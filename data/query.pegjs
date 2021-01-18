{
	options.target = options.target || "oracle";

	var _ = require('lodash');
	var keywords = {
		deathtouch: 		{cr:"702.2"},
		defender: 			{cr:"702.3"},
		"double strike": 	{cr:"702.4"},
		"first strike": 	{cr:"702.7"},
		flash: 				{cr:"702.8"},
		flying: 			{cr:"702.9"},
		haste: 				{cr:"702.10"},
		hexproof: 			{cr:"702.11"},
		intimidate: 		{cr:"702.13"},
		indestructable: 	{cr:"702.12"},
		lifelink: 			{cr:"702.15"},
		reach: 				{cr:"702.17"},
		shroud: 			{cr:"702.18"},
		trample: 			{cr:"702.19"},
		vigilance: 			{cr:"702.20"},
		flanking: 			{cr:"702.24"}, 
		phasing: 			{cr:"702.25"}, 
		shadow: 			{cr:"702.27"}, 
		horsemanship: 		{cr:"702.30"},
		fear: 				{cr:"702.35"},
		flanking:			{cr:"???.??"}
	};

	function numericQuery(name, op, val) {
		var o;
		switch ( op ) {
			case ':': 
			case '=': 
				o =  val;
				break;
			case '>': o =  {"$gt": val};  break;
			case '<': o =  {"$lt": val};  break;
			case '>=': o = {"$gte": val};  break;
			case '<=': o = {"$lte": val};  break;
		}
		var x = {};
		x[name] = o;
		return x;
	}

	function smartMap(a, f) {
		if ( _.isObject(a) ) {
			if ( '$in' in a ) return {'$in': a['$in'].map(f)};
			if ( '$all' in a ) return {'$all': a['$all'].map(f)};
		}
		else return f(a);
	}

	function textQ(a) {
		if ( _.isRegExp(a) ) return a;
		return new RegExp(a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),'i');
	}

	function fastTextQ(a) {
		if ( _.isRegExp(a) ) return a;
		return new RegExp("^" + a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),'i');
	}

	function ucfirst(str) {
		return (str + '').charAt(0).toUpperCase() + (str + '').substr(1).toLowerCase();
	}

	function mkobj(name, val) {
		var obj = {};
		obj[name] = val;
		return obj;
	}

	if ( !_.startCase ) {
		_.startCase = function(s) { 
			return _(s.split(' ')).map(ucfirst).value().join(' '); 
		};
	}
	
}

start = ws* a:QueryPartList ws* 
{
	return a;
} / ws* { return [] }

ws = [ ] ws?
EOF = !.

QueryPartList = a:ComplexQueryPart b:( ws ('and' ws)? ComplexQueryPart )*
{
	return [a].concat(b.map(function(x) { return x[2]; }));
}

ComplexQueryPart = 
a:SomewhatComplexQueryPart ws [oO][rR] ws b:ComplexQueryPart
{
	return {"$or": [a].concat(b) }; 
}
/ SomewhatComplexQueryPart


SomewhatComplexQueryPart = '(' ws? a:QueryPartList ws? ')'
{
	return {"$and": a}
}
/ QueryPart

QueryPart = NotQuery / RarityQuery / SetQuery / CMCQuery / PowerQuery / ToughnessQuery / ColorQuery / ManaQuery / TypeQuery / OracleQuery / FlavorQuery / ArtistQuery / FormatQuery / LoyaltyQuery / BanQuery / TagQuery / PriceQuery / SmartQuery / GenericQuery


UnescapedStringPart = $[^ :"()]
UnescapedStringListPart = $[^ :",()+]


String = $(UnescapedStringPart UnescapedStringPart*) / ["] a:$([^"]*) ["] { return a; }
StringListString = $(UnescapedStringListPart UnescapedStringListPart*) / ["] a:$([^"]*) ["] { return a; }

NumericValue = a:$( '-'? [0-9][.0-9]*) { return parseInt(a); }
NumericOperator = ':' / '=' / '<=' / '>=' / '>' / '<'

StringValue = b:String { return b } / '(' c:StringList ')' { return {'$in': c } }
FlexStringValue = c:CompactStringSet { return c } / b:String { return b } / '(' c:StringList ')' { return {'$in': c } }

StringList = a:StringListString b:(ws? ','  ws? StringListString)* 
{
	return [a].concat(b.map(function(x) { return x[3]; }));
}

CompactStringSet = a:StringListString o:$[,+]  b:StringListString c:($[,+] StringListString)* 
{
	var list = [a,b].concat(c.map(function(x) { 
		if ( x[0] != o ) throw "Mixing , and + in set";
		return x[1]; 
	}));

	if ( o == '+' ) return {'$all': list } 
	return {'$in': list }
}

NotQuery = ('not' ws/'-') a:QueryPart
{
	var out = {};
	_.forEach(a, function(v,k) {
		if ( !_.isObject(v) && !_.isRegExp(v) ) v = {"$eq": v};
		out[k] = {'$not': v};
	})
	return out;
}

CMCQuery = 'cmc'i ws? a:NumericOperator ws? b:NumericValue
{
	return numericQuery('cmc', a, b);
}

PowerQuery = ('pow'i / 'power'i) ws? a:NumericOperator ws? b:NumericValue
{
	return numericQuery('power', a, b);
}

ToughnessQuery = ('tou'i / 'toughness'i) ws? a:NumericOperator ws? b:NumericValue
{
	return numericQuery('toughness', a, b);
}

LoyaltyQuery = ('loyalty'i) ws? a:NumericOperator ws? b:NumericValue
{
	return numericQuery('loyalty', a, b);
}

PriceQuery = ('$') ws? a:NumericOperator ws? b:NumericValue
{
	if (options.target == "oracle") {
		return numericQuery('price', a, b);
	} else {
		return numericQuery('price.tcgPlayer.mid', a, b);
	}
}

TypeQuery = 't'i 'ype'? ':' b:StringValue
{
	return {"allTypes": smartMap(b, function(x) {
		if ( x.toLowerCase() == "legend" ) return "legendary";
		return x.toLowerCase(); 
	}) };
}

TagQuery = ('has'i / 'is'i) ':' b:StringValue
{
	return {"tags": smartMap(b, function(x) { 
		if ( /b[A-Z]/.test(x) ) return x;
		return x.toLowerCase(); 
	})}
}

SetQuery = 'e'i ':' b:FlexStringValue
{
	var q = smartMap(b, function(x) {
		var uc = x.toUpperCase();
		switch ( uc ) {
			case 'AL': return 'LEA';
			case 'BE': return 'LEB';
			case 'NEM': return 'NMS';
		}
		if ( /^p...$/i.test(x) ) {
			return 'p' + uc.substr(1);
		}
		return uc; 
	});

	if (options.target == "oracle") {
		return {"sets":  q};
	} else {
		return {"cardSet": q}
	}
	
}


Rarity = 
	[Rr] 'are'? { return "Rare" } /
	[Mm] 'ythic'? (' ' [Rr] 'are')? { return "Mythic Rare" } /
	[Uu] 'ncommon'? { return "Uncommon" } /
	[Cc] 'ommon'? { return "Common" } /
	[Ss] 'pecial'? { return "Special" }

RarityValue = b:Rarity { return b } / '(' c:RarityList ')' { return {'$in': c } }

RarityList = a:Rarity b:(ws? ','  ws? Rarity)* 
{
	return [a].concat(b.map(function(x) { return x[3]; }));
}

RarityQuery = 'r' ':' b:RarityValue
{
	return {"rarity": b};
}

ManaQuery = 'mana' a:$[!:=] b:StringValue
{
	return {"mana": b.toUpperCase()}
}

Color =
	[Rr] 'ed'? { return 'r' } /
	[Ww] 'hite'? { return 'w' } /
	[Bb] 'lack'? { return 'b' } /
	[Uu] { return 'u' } /
	[Bb] 'lue' { return 'u'} /
	[Gg] 'reen'? { return 'g' }

ColorEx = Color / $([mc])
ColorExWithSeperator = [,]? a:ColorEx { return a; }

ColorQuery = c:('ci'i / 'rci'i / 'c'i) a:$[!:=] b:(ColorEx ColorExWithSeperator*)
{
	c = c.toLowerCase();
	var multi = false;
	var colorless = false;
	var bb = [b[0]];
	bb.push.apply(bb, b[1]);
	// console.log("B", bb);
	var colors = _.compact(bb.map(function(c) {
		switch ( c ) {
			case 'r': return 'Red';
			case 'b': return 'Black';
			case 'g': return 'Green';
			case 'w': return 'White';
			case 'u': return 'Blue';
			case 'm': 
				multi = true;
				return undefined;
			case 'c':
				colorless = true;
				return undefined;
		}
	}));
	
	if ( c == 'ci' && a == ':' ) a = '~';
	if ( c == 'ci' && a == '=' ) a = '~';

	if ( c == 'rci' ) c = 'ci';
	var key = "colors";
	if ( c == 'ci' ) key = "colorIdentity";

	var primary;
	if ( colors.length > 0 ) primary = mkobj(key, mkobj((a == '=') ? "$all" : "$in", colors));

	if ( colorless ) {
		var extra = {"$or":[ mkobj(key, {"$size": 0}), mkobj(key, {"$exists": false}) ]};
		if ( primary ) primary = {"$or": [primary, extra]};
		else primary = extra;
	}

	var q = [];
	if ( primary ) q.push(primary);
	
	if ( a == '~' ) q = []; //Dont require colors in ~ search

	if ( a != ':' ) {
		var not = [];
		if ( !_.includes(colors, 'Red') ) not.push('Red');
		if ( !_.includes(colors, 'Black') ) not.push('Black');
		if ( !_.includes(colors, 'Green') ) not.push('Green');
		if ( !_.includes(colors, 'White') ) not.push('White');
		if ( !_.includes(colors, 'Blue') ) not.push('Blue');

		q.push(mkobj(key, {"$nin": not } ));
	}

	if ( multi ) {
		var x = {};
		x[key + '.1'] = {'$exists': true};
		q.push(x);
	}

	if ( q.length == 1 ) return q[0];
	else return {"$and": q};
}

OracleQuery = 'o'i ':' a:RegexString
{
	return {text: a};
}

ArtistQuery = (!ReservedWord) 'a'i 'rtist'i? ':' a:RegexString
{
	if (options.target == "oracle") {
		return {artists: a};
	} else {
		return {artist: a}
	}
}

Format = 'standard'i / 'extended'i / 'modern'i / 'vintage'i / 'legacy'i / 'commander'i / 'prismatic'i / 'freeform'i
	/ 't2'i { return "standard" } / 'edh'i { return "commander"; } / ('centitix'i / 'pd'i / 'pennydreadful'i) { return "penny dreadful"}

FormatQuery = 'f'i 'ormat'i? ':' a:Format
{
	var out = {};
	out.inFormats = _.startCase(a);
	return out;
}

FlavorQuery = ('fl'i / 'flavor'i) ':' a:RegexString
{
	return {flavor: a};
}






BanQuery = a:('banned'i/'restricted'i/'legal'i) ':' b:Format
{
	var out = {};
	out["legalities." + _.startCase(b)] = ucfirst(a);
	return out;
}

ReservedWord = ( 'or'i / 'and'i ) ( ws / EOF )

RegexString = '/' t:$([^/][^/]*) '/' f:$([i]*)
{
	return new RegExp(t, f);
} / a:String {
	return textQ(a);
}

SmartQuery = a:( SmartColor / SmarPowerToughness / SmartType / SmartRarity  / SmartAbility / SmartCMC / SmartFormat )
{
	return {'$or': [ a, {searchTerms: fastTextQ(text())}]};
}

SmarPowerToughness = p:NumericValue '/' t:NumericValue
{
	return {$and: [{power: p},{toughness: t}]};
}

SmartColor = c:$('Red'i / 'Blue'i / 'White'i / 'Green'i / 'Black'i)
{
	return {colors: _.startCase(c)};
}

SmartType = t:$('Creature'i / 'Instant'i / 'Sorcery'i / 'Land'i / 'Enchantment'i / 'Artifact'i ) 's'?
{
	return {allTypes: t.toLowerCase()};
}

SmartRarity = t:RarityValue & { t.length > 1 }
{
	return {rarity: t};
}

AbilityWord = a:$([^ ]+) & {
	return a.toLowerCase() in keywords;
} {
	return _.startCase(a);
} / 'Flyer'i {
	return "Flying"
}

SmartAbility = ('with' ws)? a:AbilityWord {
	return {text: new RegExp("\\b" + a + "\\b", 'i')};
}

SmartCMC = 'for'i ws n:NumericValue {
	return {cmc: n};
}

SmartFormat = 'in' ws a:Format
{
	var out = {};
	out.inFormats = _.startCase(a);
	return out;
}

GenericQuery = !(ReservedWord) a:RegexString
{
	return {allNames: a};
} / !(ReservedWord) a:$([^ ()][^ ()]*) {
	return {allNames: textQ(a)};
}