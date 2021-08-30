<template>
  <div>
      <div style="display: flex;">
      <router-link to="/"><img src="@/assets/heron_small.png" id="heron-logo" /></router-link>
      <h1>Search Syntax</h1>
    </div>
    <div id="navigation">
      <router-link to="/search">Search</router-link>
      <router-link to="/search/advanced/"><i>Advanced Search</i></router-link>
    </div>
    <div class="modifier">
      <h3>Card Colors</h3>
      <div class="details">
        <div class="detail-doc">
          <p>Use the <code>c:</code> keyword to find cards that have specific colors.</p>
          <p>This accepts full names, like <code>blue</code>, or the abbreviated color letters, like
            <code>u</code>.
          </p>
          <p>You can use <code>c</code> to find cards which are colorless, and
            <code>m</code> to find multicolor cards.</p>
          <p>Use the <code>c!</code> keyword instead of <code>c:</code> to exclude
            cards which don’t match the specified colors.</p>
        </div>
        <div class="detail-example">
          <syntax-example  query="c:rg">
            <span>Cards that are red or green</span>
          </syntax-example>
          <syntax-example  query="c!rg">
            <span>Cards that are red or green but not white, blue, or black</span>
          </syntax-example>
          <syntax-example  query="c!rgm">
            <span>Multicolor cards which are red and green but not white, blue, or
              black <i>(ie. only Gruul cards)</i></span>
          </syntax-example>
        </div>
      </div>
    </div>
    <div class="modifier">
      <h3>Card Types</h3>
      <div class="details">
        <div class="detail-doc">
          <p>Find cards of a certain card type with the <code>t:</code> or <code>type:</code>
            keywords. You can search for any supertype, card type, or subtype.</p>
        </div>
        <div class="detail-example">
          <syntax-example  query="t:werewolf">
            <span>Cards which are werewolves</span>
          </syntax-example>
        </div>
      </div>
    </div>
    <div class="modifier">
      <h3>Oracle Text</h3>
      <div class="details">
        <div class="detail-doc">
          <p>Use the <code>o:</code> keyword to find cards that have specific phrases in
            their text box.</p>
          <p>You can put quotes <code>" "</code> around text with punctuation or spaces.</p>
          <p>You can use <code>~</code> in your text as a placeholder for the card’s name.</p>
        </div>
        <div class="detail-example">
          <syntax-example  query='o:"When ~ enters the battlefield"'>
            <span>Cards with an ability that triggers when they enter the battlefield</span>
          </syntax-example>
        </div>
      </div>
    </div>
    <div class="modifier">
      <h3>Mana Costs</h3>
      <div class="details">
        <div class="detail-doc">
          <p>Use the <code>mana:</code> keyword to search for cards that have certain
            mana costs.</p>
          <p>This keyword uses the official text version of mana costs set forth in the <a
              href="https://magic.wizards.com/en/game-info/gameplay/rules-and-formats/rules">Comprehensive
              Rules</a>. For example, <code>{G}</code> represents a green mana.</p>
          <p>Shorthand for is allowed for symbols that aren’t split: <code>G</code> is the same as
            <code>{G}</code>
          </p>
          <p>However, you must always wrap complex/split symbols like <code>{2/G}</code>
            in braces.</p>
        </div>
        <div class="detail-example">
          <syntax-example  query="mana:2W">
            <span>Cards which cost exactly two generic and one white mana</span>
          </syntax-example>
        </div>
      </div>
    </div>
    <div class="modifier">
      <h3>Power, Toughness, and Loyalty</h3>
      <div class="details">
        <div class="detail-doc">
          <p>You can use numeric expressions (<code>&gt;</code>, <code>&lt;</code>, <code>=</code>,
            <code>&gt;=</code>, and <code>&lt;=</code>) to find cards with certain power,
            <code>pow</code>, toughness, <code>tou</code>, or starting loyalty,
            <code>loyalty</code>.
          </p>
        </div>
        <div class="detail-example">
          <syntax-example  query="pow>3 tou<=3">
            <span>Cards with power greater than three and toughness less than
              or equal to three.</span>
          </syntax-example>
        </div>
      </div>
    </div>
    <div class="modifier">
      <h3>Shortcuts</h3>
      <div class="details">
        <div class="detail-doc">
          <p>You can find cards that
          <ul>
            <li>transform with <code>is:transform</code>.</li>
            <li>have aftermath with <code>is:aftermath</code>.</li>
          </ul>
          </p>
        </div>
        <div class="detail-example">
          <syntax-example  query="is:transform t:werewolf">
            <span>Werewolves which transform.</span>
          </syntax-example>
          <syntax-example  query="is:aftermath c!r">
            <span>Aftermath cards where both halves are red.</span>
          </syntax-example>
        </div>
      </div>
    </div>
    <div class="modifier">
      <h3>Rarity</h3>
      <div class="details">
        <div class="detail-doc">
          <p>Use <code>r:</code> to find cards by their print rarity. You can
            search for <code>common</code>,
            <code>uncommon</code>, <code>rare</code>, <code>mythic</code>.
          </p>
        </div>
        <div class="detail-example">
          <syntax-example  query="r:rare t:creature">
            <span>Creature cards printed at rare.</span>
          </syntax-example>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SyntaxExample from '@/components/SyntaxExample.vue';

export default {
  name: 'SyntaxHelp',
  components: { SyntaxExample },
};
</script>

<style scoped>

#heron-logo {
  margin-top: 1.5em;
  padding-right: 15px;
}
#navigation {
  position: absolute;
  right: 30px;
  top: 30px;
}
#navigation a:first-child {
  margin-right: 15px;
}

a {
  color: blue;
  text-decoration: none;
}

a i {
  opacity: 0.7;
}

.modifier {
  border-bottom: 2px solid #ddd;
}

.details {
  display: flex;
  justify-content: space-around;
}

.detail-doc, .detail-example {
  width: 38%;
}

.details code {
  background-color: #efefef;
  padding: 3px;
  border-radius: 2px;
}

@media screen and (max-width: 600px) {
  .details {
    display: block;
  }
  .detail-doc, .detail-example {
    width: 76%;
    margin: 0 auto;
  }
  #navigation {
    top: 7px;
    right: 7px;
  }
}
</style>
