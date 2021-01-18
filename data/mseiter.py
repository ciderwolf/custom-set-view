import re


class MSEIterator:
    def __init__(self, text):
        self.text = text.replace("\r", "")[1:] + "\n"
        self.lines = self.text.split("\n")
        self.line_index = 0

    def _split(self, line):
        tokens = line.split(": ")
        if len(tokens) == 1:
            return tokens[0][:-1], None
        return tokens[0], ": ".join(tokens[1:])

    def _indent(self, line):
        return len(re.findall("^\t*", line)[0])

    @property
    def line(self):
        return self.lines[self.line_index]

    @property
    def next_line(self):
        return self.lines[self.line_index + 1]

    @property
    def has_next(self):
        return self.line_index < len(self.lines) - 1

    @property
    def prev_indent(self):
        return self._indent(self.lines[self.line_index])

    @property
    def indent(self):
        return self._indent(self.lines[self.line_index])

    def has_key(self, line):
        return re.match(r"(\s+|^)[a-z0-9 -]+:", line)

    def next(self):
        line = self.line.lstrip()
        if ":" in line:
            key, value = self._split(line)
            if self.has_next and value is None:
                # start of a child block
                if not self.has_key(self.next_line):
                    # multi-line string
                    values = []
                    next_indent = self._indent(self.next_line)
                    while (
                        self.has_next
                        and not self.has_key(self.next_line)
                        and self._indent(self.next_line) == next_indent
                    ):
                        values.append(self.next_line.lstrip())
                        self.line_index += 1
                    value = "\n".join(values)
            self.line_index += 1
            return key, value
        elif self.has_next:
            self.line_index += 1
            return self.next()
        else:
            return None

    def to_dict(self):
        prev_indent = self.indent
        data = {}
        kv = None
        while self.has_next and self.indent == prev_indent:
            kv = self.next()
            if kv is None:
                return data
            key, value = kv

            if value is None:
                # Consume children
                if self.prev_indent < prev_indent:
                    # pop out
                    return data
                self.dict_add(data, key, self.to_dict())
            else:
                # return value
                self.dict_add(data, key, value)
        return data

    def dict_add(self, data, key, value):
        if key in data:
            if isinstance(data[key], list):
                data[key].append(value)
            else:
                data[key] = [data[key], value]
        else:
            data[key] = value
