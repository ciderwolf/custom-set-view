import json
import re
import os
import shutil
import sys
from typing import Tuple, List
from zipfile import ZipFile
from functools import cmp_to_key
from PIL import Image
from mseiter import MSEIterator


def card_to_num(card) -> int:
    if len(card["color"]) > 1:
        val = 600
    elif len(card["color"]) == 0:
        val = 700
    else:
        colors = "WUBRG C"
        val = (colors.index(card["color"]) + 1) * 100

    if card["aftermath"]:
        val += 10
    if "Artifact" in card["types"] and val == 700:
        val += 1
    elif "Land" in card["types"] and val >= 700:
        val += 10

    return val


def compare_cards(a, b) -> int:
    a_val = card_to_num(a)
    b_val = card_to_num(b)
    if a_val == b_val:
        a_name = a["name"]
        if a_name.startswith("The "):
            a_name = a_name[4:]
        b_name = b["name"]
        if b_name.startswith("The "):
            b_name = b_name[4:]
        return 1 if a_name > b_name else -1
    else:
        return 1 if a_val > b_val else -1


def strip_tags(text: str) -> str:
    return re.sub(r"</?[a-zA-Z0-9\-:/._]+>", "", text)


def process_tag(match: re.Match) -> str:
    tag = match.group(0)
    tags = ["<sym", "</sym", "<i", "</i"]
    tag_complete = ["<sym>", "</sym>", "<i>", "</i>"]
    for i, t in enumerate(tags):
        if tag.startswith(t):
            return tag_complete[i]
    return ""


def process_symbols(cost: str) -> str:
    out = ""
    for char in cost:
        out += f'<abbr class="card-symbol card-symbol-{char}">{{{char}}}</abbr>'
    return out


def html_tag(text: str) -> str:
    text = re.sub(r"</?[a-zA-Z0-9\-:/._]+>", process_tag, text)
    text = re.sub(
        r"<sym>([A-Za-z0-9]+)</sym>", lambda m: process_symbols(m.groups()[0]), text
    )
    return re.sub(r"(.*)\n", r"<p>\1</p>", text)


def get_types(super_t: str, sub_t: str) -> Tuple[str, List[str]]:
    supertypes = strip_tags(super_t).strip()
    subtypes = strip_tags(sub_t).strip()
    typeline = supertypes + (" \u2014 " + subtypes if len(subtypes) > 0 else "")
    types = supertypes.split(" ")
    if len(subtypes) > 0:
        types.extend(subtypes.split(" "))

    return typeline, types


def parse_text(card) -> Tuple[str, str]:
    style = card["stylesheet"]
    text = card.get("rule text", "")
    flavor = card.get("flavor text", "")
    if "saga" in style and "level 3 text" in card:
        text += "\nI — " + card["level 1 text"]
        text += "\nII — " + card["level 2 text"]
        text += "\nIII — " + card["level 3 text"]
    elif "Planeswalker" in card["super type"] and "rule text" in card:
        ability_count = (
            (strip_tags(text) + "\n" + strip_tags(flavor)).strip().split("\n")
        )
        if flavor:
            text += "\n" + flavor.strip()
        abilities = text.split("\n")
        text = ""
        flavor = ""
        for i in range(1, len(ability_count) + 1):
            cost = card[f"loyalty cost {i}"]
            abilities[i - 1] = cost + ": " + abilities[i - 1]

        text = "\n".join(abilities)
    elif "Planeswalker" in card["super type"] and "rule text" not in card:
        abilities = []
        for i in range(1, 5):
            if f"level {i} text" in card and f"loyalty cost {i}" in card:
                ability = card[f"level {i} text"]
                cost = card[f"loyalty cost {i}"]
                abilities.append((cost, ability))
        ability_text = [(x + ": " if x else "") + y for x, y in abilities]

        text = "\n".join(ability_text)

    return text, flavor


def get_back_face(card):
    if "name 2" not in card:
        return None
    elif "rule text 2" not in card:
        # Bind // Torture // Kill
        return None
    simple_name = str(
        card["name 2"].encode("ascii", errors="ignore"), encoding="utf8"
    ).replace(",", "")
    typeline, types = get_types(card["super type 2"], card["sub type 2"])

    data = {
        "stylesheet": "m15",
        "rule text": card["rule text 2"],
        "flavor text": card["flavor text 2"],
        "super type": card["super type 2"],
        "loyalty cost 1": card.get("loyalty cost 5", ""),
        "loyalty cost 2": card.get("loyalty cost 6", ""),
        "loyalty cost 3": card.get("loyalty cost 7", ""),
    }

    text, flavor = parse_text(data)

    return {
        "name": card["name 2"],
        "simple_name": simple_name,
        "color": "",
        "cost": card.get("casting cost 2", None),
        "typeline": typeline,
        "types": types,
        "power": card.get("power 2", None),
        "toughness": card.get("toughness 2", None),
        "loyalty": card.get("loyalty 2", None),
        "text": strip_tags(text),
        "html": html_tag(text),
        "flavor": strip_tags(flavor),
        "artist": card.get("illustrator 2", None),
    }


def process_data(cards: List[dict]) -> list:
    card_list = []
    for card in cards:
        simple_name = str(
            card["name"].encode("ascii", errors="ignore"), encoding="utf8"
        ).replace(",", "")

        combined_cost = (
            (card["casting cost"] + (card.get("casting cost 2", "")))
            if "casting cost" in card
            else "C"
        )

        color = "".join(set(re.sub(r"[\d+X ]", "", combined_cost)))
        typeline, types = get_types(card["super type"], card["sub type"])

        if "rarity" not in card:
            card["rarity"] = "common"
        if "stylesheet" not in card:
            card["stylesheet"] = "m15"
        text, flavor = parse_text(card)
        data = {
            "name": card["name"],
            "simple_name": simple_name,
            "color": color,
            "cost": card.get("casting cost", ""),
            "typeline": typeline,
            "types": types,
            "power": card.get("power", None),
            "toughness": card.get("toughness", None),
            "loyalty": card.get("loyalty", None),
            "text": strip_tags(text),
            "html": html_tag(text),
            "flavor": strip_tags(flavor),
            "artist": card.get("illustrator", ""),
            "rarity": card["rarity"][0].upper(),
            "number": 0,
            "dfc": "dfc" in card["stylesheet"] or "doublefaced" in card["stylesheet"],
            "aftermath": "aftermath" in card["stylesheet"],
            "back": get_back_face(card),
        }
        card_list.append(data)
    return card_list


if __name__ == "__main__":

    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <path_to_set_file> <path_to_img_dir>")
        sys.exit(1)
    set_path = sys.argv[1]
    image_path = sys.argv[2]
    img_output = os.path.join(os.path.dirname(__file__), "../public/img")
    data_output = os.path.join(os.path.dirname(__file__), "../src/assets/data.json")
    small_size = (255, 356)

    with ZipFile(set_path) as archive:
        with archive.open("set", "r") as datafile:
            iterator = MSEIterator(datafile.read().decode("utf-8"))
            data = iterator.to_dict()
            cards = process_data(data["card"])
            cards = sorted(cards, key=cmp_to_key(compare_cards))
            card_dict = {}
            for i, card in enumerate(cards):
                card["number"] = i + 1
                card_dict[card["simple_name"]] = card

            if os.path.exists(os.path.join(img_output, "large/img")):
                shutil.rmtree(os.path.join(img_output, "large/img"))
            if os.path.exists(os.path.join(img_output, "small/img")):
                shutil.rmtree(os.path.join(img_output, "small/img"))
            os.makedirs(os.path.join(img_output, "large/img"))
            os.makedirs(os.path.join(img_output, "small/img"))
            for land in ["Plains", "Island", "Swamp", "Mountain", "Forest"]:
                img = Image.open(
                    os.path.join(os.path.dirname(__file__), f"basics/{land}.jpg")
                )
                img.save(os.path.join(img_output, f"large/img/{land}.jpg"))
                img.resize(small_size).save(
                    os.path.join(img_output, f"small/img/{land}.jpg")
                )
            if os.path.exists(os.path.join(img_output, "large/transform")):
                shutil.rmtree(os.path.join(img_output, "large/transform"))
            if os.path.exists(os.path.join(img_output, "small/transform")):
                shutil.rmtree(os.path.join(img_output, "small/transform"))
            os.makedirs(os.path.join(img_output, "large/transform"))
            os.makedirs(os.path.join(img_output, "small/transform"))

            for key in card_dict.keys():
                img = Image.open(os.path.join(image_path, f"{key}.jpg"))
                img.save(os.path.join(img_output, f"large/img/{key}.jpg"))

                if card_dict[key]["dfc"]:
                    img.resize((small_size[0] * 2 + 2, small_size[1])).save(
                        os.path.join(img_output, f"small/img/{key}.jpg")
                    )
                    left = img.crop((0, 0, img.size[0] / 2 - 1, img.size[1]))
                    right = img.crop((img.size[0] / 2 + 1, 0, img.size[0], img.size[1]))
                    left.save(
                        os.path.join(img_output, f"large/transform/{key}_front.jpg")
                    )
                    right.save(
                        os.path.join(img_output, f"large/transform/{key}_back.jpg")
                    )
                    left.resize(small_size).save(
                        os.path.join(img_output, f"small/transform/{key}_front.jpg")
                    )
                    right.resize(small_size).save(
                        os.path.join(img_output, f"small/transform/{key}_back.jpg")
                    )
                else:
                    img.resize(small_size).save(
                        os.path.join(img_output, f"small/img/{key}.jpg")
                    )
            json.dump(card_dict, open(data_output, "w"), indent=2)
