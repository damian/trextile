var Textdown = function(text) {
  this.textile = text;
  this.text = "";
};

Textdown.prototype.convertHeaders = function() {
  var headerRegex = /^(h[1-6])\.\s?(.*)$/gm;
  this.text = this.textile.replace(headerRegex, "<$1>$2</$1>");
};

Textdown.prototype.convertBlockQuotes = function() {
  var blockQuoteRegex = /^bq\.\s?(.*)$/gm;
  this.text = this.text.replace(blockQuoteRegex, "<blockquote><p>$1</p></blockquote>");
};

Textdown.prototype.convertLists = function() {
  var listsRegex = /^[#*]\s(.*)$/gm;

  var foo = function(match, p0, place, matches) {
    var output = "";
    if (place === 0) {
      output = "<ol>";
      var listItems = matches.split(/\n/gm);

      for (var i = 0; i < listItems.length; i++) {
        var item = listItems[i];
        output += "<li>" + item.substr(2) + "</li>";
      }
      output += "</ol>";
    }
    return output;
  };

  this.text = this.text.replace(listsRegex, foo);
};

Textdown.prototype.convertParagraphs = function() {
  var paragraphs = this.text.trim().split(/\n{2,}/gm);

  for (var i = 0; i < paragraphs.length; i++) {
    var token = paragraphs[i];
    if (token.charAt(0) !== "<") {
      paragraphs[i] = "<p>" + paragraphs[i] + "</p>";
    }
  }

  this.text = paragraphs.join('');
};

Textdown.prototype.convertQuotes = function() {
  var openingDoubleQuote = "&#8220;",
      closingDoubleQuote = "&#8221;",
      doubleQuoteRegex = /\"([^\"]*)\"/g;

  this.text = this.text.replace(doubleQuoteRegex, openingDoubleQuote + "$1" + closingDoubleQuote);
};

Textdown.prototype.convertDoubleHyphens = function() {
  this.text = this.text.replace(/\s*--\s*/gm, '&#8212;');
};

Textdown.prototype.convertSingleHyphens = function() {
  this.text = this.text.replace(/\s*-\s*/gm, '&#8211;');
};

Textdown.prototype.convertTripleDots = function() {
  this.text = this.text.replace(/\.{3}/gm, '&#8230;');
};

Textdown.prototype.convertDimensions = function() {
  this.text = this.text.replace(/\sx\s/gm, '&#215;');
};

Textdown.prototype.convertSymbols = function() {
  var symbolRegex = /\((TM|R|C)\)/gm;

  function symbolSub(match) {
    var symbolMap = {
      '(TM)': "&#8482;",
      '(R)': "&#174;",
      '(C)': "&#169;"
    };

    return symbolMap[match];
  }

  this.text = this.text.replace(symbolRegex, symbolSub);
};

Textdown.prototype.toHtml = function() {
  this.convertHeaders();
  this.convertQuotes();
  this.convertDoubleHyphens();
  this.convertSingleHyphens();
  this.convertTripleDots();
  this.convertDimensions();
  this.convertSymbols();

  this.convertBlockQuotes();
  this.convertLists();
  this.convertParagraphs();

  return this.text;
};
