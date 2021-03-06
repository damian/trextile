describe("Trextile", function() {
  describe("lists", function() {
    it("should convert any line containing a # at the front and wrap it in an ordered list", function() {
      inst = new Trextile("# Foo\n# Bar\n# Baz\n");
      expect(inst.toHtml()).toEqual("<ol><li>Foo</li><li>Bar</li><li>Baz</li></ol>");
    });

    it("should convert any line containing a * at the front and wrap it in an unordered list", function() {
      inst = new Trextile("* Foo\n* Bar\n* Baz");
      expect(inst.toHtml()).toEqual("<ul><li>Foo</li><li>Bar</li><li>Baz</li></ul>");
    });

    it("should not convert any line starting with an asterisk and containing an asterisk to be a list item", function() {
      inst = new Trextile("* Foo Bar*\n\n* Baz");
      expect(inst.toHtml()).toEqual("<p><strong> Foo Bar</strong></p><ul><li>Baz</li></ul>");
    });
  });

  describe("convert headers", function() {
    it("should convert a newline starting with `h1. Foo` to <h1>Foo</h1>", function() {
      inst = new Trextile("h1. Foo");
      expect(inst.toHtml()).toEqual("<h1>Foo</h1>");
    });

    it("should convert a newline starting with `h1. Foo\nh6. Bar` to <h1>Foo</h1>\n<h6>Bar</h6>", function() {
      inst = new Trextile("h1. Foo\n\nh6. Bar");
      expect(inst.toHtml()).toEqual("<h1>Foo</h1><h6>Bar</h6>");
    });
  });

  describe("convert blockquotes", function() {
    it("should convert a newline starting with `bq. Foo` to <blockquote><p>Foo</p></blockquote>", function() {
      inst = new Trextile("Bar\n\nbq. Foo");
      expect(inst.toHtml()).toEqual("<p>Bar</p><blockquote><p>Foo</p></blockquote>");
    });
  });

  describe("convert paragraphs", function() {
    it("should convert any line which starts with two nonbreaking spaces in to a paragraph", function() {
      inst = new Trextile("Hello\n\nWorld");
      expect(inst.toHtml()).toEqual("<p>Hello</p><p>World</p>");
    });

    it("should not convert any block level element in to a paragraph", function() {
      inst = new Trextile("h1. Foo\n\nBar");
      expect(inst.toHtml()).toEqual("<h1>Foo</h1><p>Bar</p>");
    });
  });

  describe("double quotes", function() {
    it("should convert double quotes in to encoded entities", function() {
      inst = new Trextile("h1. Foo bar\n\nMy name is \"Damian Nicholson\"");
      expect(inst.toHtml()).toEqual("<h1>Foo bar</h1><p>My name is &#8220;Damian Nicholson&#8221;</p>");
    });
  });

  describe("double hypens", function() {
    it("should convert double hyphens in to an encoded entity", function() {
      inst = new Trextile("Observe -- very nice!");
      expect(inst.toHtml()).toEqual("<p>Observe&#8212;very nice!</p>");
    });
  });

  describe("single hypens", function() {
    it("should convert single hyphens in to an encoded entity", function() {
      inst = new Trextile("Observe - very!");
      expect(inst.toHtml()).toEqual("<p>Observe &#8211; very!</p>");
    });
  });

  describe("triple dots", function() {
    it("should convert triple dots in to an ellipsis", function() {
      inst = new Trextile("Observe...");
      expect(inst.toHtml()).toEqual("<p>Observe&#8230;</p>");
    });
  });

  describe("dimensions", function() {
    it("should convert a single x in to an encoded entity", function() {
      inst = new Trextile("Observe 2 x 2");
      expect(inst.toHtml()).toEqual("<p>Observe 2&#215;2</p>");
    });
  });

  describe("symbols", function() {
    it("should convert trademark, copyright and registered symbols in to encoded entities", function() {
      inst = new Trextile("One(TM), Two(R), Three(C).");
      expect(inst.toHtml()).toEqual("<p>One&#8482;, Two&#174;, Three&#169;.</p>");
    });
  });

  describe("links", function() {
    it("should convert any link in to an anchor with a href", function() {
      inst = new Trextile('Some text to go here that links to the "Google":http://google.com homepage');
      expect(inst.toHtml()).toEqual("<p>Some text to go here that links to the <a href=\"http://google.com\">Google</a> homepage</p>");
    });

    it("should ensure that any links which end with a special character aren't embedded in the link", function() {
      inst = new Trextile('Some text to go here that links to the "Google":http://google.com!');
      expect(inst.toHtml()).toEqual("<p>Some text to go here that links to the <a href=\"http://google.com\">Google</a>!</p>");
    });
  });

  describe("images", function() {
    it("should convert any images in to an img tag", function() {
      inst = new Trextile('Some text to go here and an inline !http://placehold.it/350x150!');
      expect(inst.toHtml()).toEqual("<p>Some text to go here and an inline <img src=\"http://placehold.it/350x150\" alt=\"\" /></p>");
    });

    it("should preserve any alt information as part of the image", function() {
      inst = new Trextile('Some text to go here and an inline !http://placehold.it/350x150(Foo)!');
      expect(inst.toHtml()).toEqual("<p>Some text to go here and an inline <img src=\"http://placehold.it/350x150\" alt=\"Foo\" /></p>");
    });
  });

  describe("quick phrase modifiers", function() {
    it("should convert any words prefixed and suffixed with underscores in to em tags", function() {
      inst = new Trextile('Some text to go _here_ and _also here_.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <em>here</em> and <em>also here</em>.</p>");
    });

    it("should convert any words prefixed and suffixed with stars in to strong tags", function() {
      inst = new Trextile('Some text to go *here* and *also here*.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <strong>here</strong> and <strong>also here</strong>.</p>");
    });

    it("should convert any words prefixed and suffixed with two question marks in to cite tags", function() {
      inst = new Trextile('Some text to go ??here?? and ??also here??.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <cite>here</cite> and <cite>also here</cite>.</p>");
    });

    it("should convert any words prefixed and suffixed with at symbols to code tags", function() {
      inst = new Trextile('Some text to go @here@.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <code>here</code>.</p>");
    });

    it("should convert any words prefixed and suffixed with hyphens to del tags", function() {
      inst = new Trextile('Some text to go -here-.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <del>here</del>.</p>");
    });

    it("should convert any words prefixed and suffixed with plus symbols to ins tags", function() {
      inst = new Trextile('Some text to go +here+.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <ins>here</ins>.</p>");
    });

    it("should convert any words prefixed and suffixed with caret symbols to sup tags", function() {
      inst = new Trextile('Some text to go ^here^.');
      expect(inst.toHtml()).toEqual("<p>Some text to go <sup>here</sup>.</p>");
    });
  });

  describe("ignore pre blocks", function() {
    it("should ensure any pre blocks within the text remain in tact", function() {
      inst = new Trextile("Hello world\n\n<pre><code>h1. Foo</code></pre>\n\n<pre><code>h2. Bar</code></pre>");
      expect(inst.toHtml()).toEqual("<p>Hello world</p><pre><code>h1. Foo</code></pre><pre><code>h2. Bar</code></pre>");
    });
  });
});
