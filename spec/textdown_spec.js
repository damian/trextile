describe("Textdown", function() {
  describe("convert headers", function() {
    it("should convert a newline starting with `h1. Foo` to <h1>Foo</h1>", function() {
      inst = new Textdown("h1. Foo");
      expect(inst.toHtml()).toEqual("<h1>Foo</h1>");
    });

    it("should convert a newline starting with `h1. Foo\nh6. Bar` to <h1>Foo</h1>\n<h6>Bar</h6>", function() {
      inst = new Textdown("h1. Foo\nh6. Bar");
      expect(inst.toHtml()).toEqual("<h1>Foo</h1>\n<h6>Bar</h6>");
    });
  });

  describe("convert blockquotes", function() {
    it("should convert a newline starting with `bq. Foo` to <blockquote><p>Foo</p></blockquote>", function() {
      inst = new Textdown("Bar\n\nbq. Foo");
      expect(inst.toHtml()).toEqual("<p>Bar</p><blockquote><p>Foo</p></blockquote>");
    });
  });

  describe("convert paragraphs", function() {
    it("should convert any line which starts with two nonbreaking spaces in to a paragraph", function() {
      inst = new Textdown("Hello\n\nWorld");
      expect(inst.toHtml()).toEqual("<p>Hello</p><p>World</p>");
    });

    it("should not convert any block level element in to a paragraph", function() {
      inst = new Textdown("h1. Foo\n\nBar");
      expect(inst.toHtml()).toEqual("<h1>Foo</h1><p>Bar</p>");
    });
  });

  describe("double quotes", function() {
    it("should convert double quotes in to encoded entities", function() {
      inst = new Textdown("h1. Foo bar\n\nMy name is \"Damian Nicholson\"");
      expect(inst.toHtml()).toEqual("<h1>Foo bar</h1><p>My name is &#8220;Damian Nicholson&#8221;</p>");
    });
  });

  describe("double hypens", function() {
    it("should convert double hyphens in to an encoded entity", function() {
      inst = new Textdown("Observe -- very nice!");
      expect(inst.toHtml()).toEqual("<p>Observe&#8212;very nice!</p>");
    });
  });

  describe("single hypens", function() {
    it("should convert single hyphens in to an encoded entity", function() {
      inst = new Textdown("Observe - very -- nice!");
      expect(inst.toHtml()).toEqual("<p>Observe&#8211;very&#8212;nice!</p>");
    });
  });

  describe("triple dots", function() {
    it("should convert triple dots in to an ellipsis", function() {
      inst = new Textdown("Observe...");
      expect(inst.toHtml()).toEqual("<p>Observe&#8230;</p>");
    });
  });

  describe("dimensions", function() {
    it("should convert a single x in to an encoded entity", function() {
      inst = new Textdown("Observe 2 x 2");
      expect(inst.toHtml()).toEqual("<p>Observe 2&#215;2</p>");
    });
  });

  describe("symbols", function() {
    it("should convert trademark, copyright and registered symbols in to encoded entities", function() {
      inst = new Textdown("One(TM), Two(R), Three(C).");
      expect(inst.toHtml()).toEqual("<p>One&#8482;, Two&#174;, Three&#169;.</p>");
    });
  });

  describe("lists", function() {
    describe("ordered lists", function() {
      it("should convert any line containing a # at the front and wrap it in an ordered list", function() {
        inst = new Textdown("# Foo\n# Bar\n# Baz");
        expect(inst.toHtml()).toEqual("<ol><li>Foo</li><li>Bar</li><li>Baz</li></ol>");
      });

      it("should convert any line containing a # at the front and wrap it in an ordered list", function() {
        inst = new Textdown("# Foo\n# Bar\n# Baz\n\nFoo\n\n# Foo\n# Bar\n# Baz");
        expect(inst.toHtml()).toEqual("<ol><li>Foo</li><li>Bar</li><li>Baz</li></ol><p>Foo</p><ol><li>Foo</li><li>Bar</li><li>Baz</li></ol>");
      });
    });
  });
});
