/**
 * Textdown is a lightweight Textile to HTML conversion tool
 *
 * @class Textdown
 * @constructor
 */
var Textdown = function(text) {

  /**
   * @property textile
   * @type String
   */
  this.textile = text;

  /**
   * @property text
   * @type String
   */
  this.text = this.textile;

  /**
   * @property preBlocks
   * @type Array
   * @default []
   */
  this.preBlocks = [];
};

/**
 * Converts block h1-h6 textile tags to HTML header tags
 *
 * @method convertHeaders
 */
Textdown.prototype.convertHeaders = function() {
  var headerRegex = /^(h[1-6])\.\s?(.*)$/gm;
  this.text = this.text.replace(headerRegex, "<$1>$2</$1>");
};

/**
 * Converts block bq textile tags to be wrapped in blockquote HTML tags
 *
 * @method convertBlockQuotes
 */
Textdown.prototype.convertBlockQuotes = function() {
  var blockQuoteRegex = /^bq\.\s?(.*)$/gm;
  this.text = this.text.replace(blockQuoteRegex, "<blockquote><p>$1</p></blockquote>");
};

/**
 * Converts numbered and bulleted textile tags to ordered and unordered HTML lists
 *
 * @method convertLists
 */
Textdown.prototype.convertLists = function() {
  var output = "",
      lines = this.text.split(/\n/gm),
      inList = false,
      listType = 'ul';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i],
        isOrderedList = line.charAt(0) === '#',
        isUnorderedList = line.charAt(0) === '*';

    if (isOrderedList || isUnorderedList) {
      if (isOrderedList) {
        listType = 'ol';
      }
      if (!inList) {
        inList = true;
        output += "<" + listType + ">";
      }
      output += "<li>" + line.substr(2) + "</li>";
      if (i === lines.length - 1) {
        inList = false;
        output += "</" + listType + ">";
      }
    } else {
      if (line.length === 0 && inList) {
        inList = false;
        output += "</" + listType + ">";
      }
      output += "\n" + line + "\n";
    }
  }

  this.text = output;
};

/**
 * Parse preformatted HTML text from the textile document and replace
 * them with placeholder elements
 *
 * @method parsePreBlocks
 */
Textdown.prototype.parsePreBlocks = function() {
  var preblockRegex = /(<pre[^>]*>[\s\S]+?<\/pre>)/gm,
      matches = this.text.match(preblockRegex) || [];

  if (matches.length) {
    this.preBlocks = matches;
    this.text = this.text.replace(preblockRegex, '^^^^^^');
  }
};

/**
 * Replaces the placeholder elements with the preformatted HTML text
 *
 * @method revertPreBlocks
 */
Textdown.prototype.revertPreBlocks = function() {
  if (this.preBlocks.length) {
    for (var i = 0; i < this.preBlocks.length; i++) {
      var block = this.preBlocks[i];
      this.text = this.text.replace('^^^^^^', block);
    }
  }
};

/**
 * Wraps each paragraph of textile in p HTML tags
 *
 * @method convertParagraphs
 */
Textdown.prototype.convertParagraphs = function() {
  var paragraphs = this.text.trim().split(/\n{2,}/gm);

  for (var i = 0; i < paragraphs.length; i++) {
    var token = paragraphs[i];

    // Naive detection for HTML tag at the start of a line or a preformatted code block
    if (token.charAt(0) !== "<" && token !== '^^^^^^') {
      paragraphs[i] = "<p>" + paragraphs[i] + "</p>";
    }
  }

  this.text = paragraphs.join('');
};

/**
 * Converts double quotes in to encoded entites
 *
 * Ensures that double quotes within links aren't subject to encoding
 *
 * @method convertQuotes
 */
Textdown.prototype.convertQuotes = function() {
  var openingDoubleQuote = "&#8220;",
      closingDoubleQuote = "&#8221;",
      doubleQuoteRegex = /\s\"([^\"]+)\"/gm;

  this.text = this.text.replace(doubleQuoteRegex, function(m0) {
    var output = m0;
    output = output.replace(/\"/, openingDoubleQuote);
    output = output.replace(/\"/, closingDoubleQuote);

    return output;
  });
};

/**
 * Converts double hypens to encoded entities
 *
 * @method convertDoubleHyphens
 */
Textdown.prototype.convertDoubleHyphens = function() {
  this.text = this.text.replace(/\s*--\s*/gm, '&#8212;');
};

/**
 * Converts single hypens to encoded entities
 *
 * @method convertSingleHyphens
 */
Textdown.prototype.convertSingleHyphens = function() {
  this.text = this.text.replace(/\s*-\s*/gm, '&#8211;');
};

/**
 * Converts triple dots to a ellipsis entities
 *
 * @method convertTripleDots
 */
Textdown.prototype.convertTripleDots = function() {
  this.text = this.text.replace(/\.{3}/gm, '&#8230;');
};

/**
 * Converts textile dimensions to use encoded entities
 *
 * @method convertDimensions
 */
Textdown.prototype.convertDimensions = function() {
  this.text = this.text.replace(/\sx\s/gm, '&#215;');
};

/**
 * Converts any special symbols in the textile to encoded entities
 *
 * @method convertSymbols
 */
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

/**
 * Converts textile links to anchor tags
 *
 * @method convertLinks
 */
Textdown.prototype.convertLinks = function() {
  var linkRegex = /\"([^\"]+)\"\:((http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-\_]*[\w@?^=%&amp;\/~+#-\)]))?/gm;

  this.text = this.text.replace(linkRegex, "<a href=\"$2\">$1</a>");
};

/**
 * Converts textile images to img tags with an appropriate alt tag
 *
 * @method convertImages
 */
Textdown.prototype.convertImages = function() {
  var imgRegex = /!(([^!\s\(]+)(\((\w+)\))?)!/gm;

  this.text = this.text.replace(imgRegex, function(full, m1, m2, m3, m4) {
    m4 = m4 || "";
    return "<img src=\"" + m2 + "\" alt=\"" + m4 + "\" />";
  });
};

/**
 * Converts phrases wrapped in underscores to HTML emphasis tags
 *
 * @method convertEmphasis
 */
Textdown.prototype.convertEmphasis = function() {
  var emphasisRegex = /_([^_]+)_/gm;

  this.text = this.text.replace(emphasisRegex, "<em>$1</em>");
};

/**
 * Converts phrases wrapped in asterisks to HTML strong tags
 *
 * @method convertBold
 */
Textdown.prototype.convertBold = function() {
  var boldRegex = /(?!^)\*([^\*]+)\*/gm;

  this.text = this.text.replace(boldRegex, "<strong>$1</strong>");
};

/**
 * Converts phrases wrapped with double question marks to HTML cite tags
 *
 * @method convertCitations
 */
Textdown.prototype.convertCitations = function() {
  var citationRegex = /\?{2}([^\?]+)\?{2}/gm;

  this.text = this.text.replace(citationRegex, "<cite>$1</cite>");
};

/**
 * Performs the Textile to HTML conversion
 *
 * @method toHtml
 * @return String The HTML text
 */
Textdown.prototype.toHtml = function() {
  this.parsePreBlocks();
  this.convertHeaders();
  this.convertLinks();
  this.convertImages();
  this.convertQuotes();
  this.convertDoubleHyphens();
  this.convertSingleHyphens();
  this.convertTripleDots();
  this.convertDimensions();
  this.convertSymbols();

  this.convertEmphasis();
  this.convertBold();
  this.convertCitations();

  this.convertBlockQuotes();
  this.convertLists();
  this.convertParagraphs();

  this.revertPreBlocks();

  return this.text;
};
