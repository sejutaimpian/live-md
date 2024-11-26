const initText = `# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/sample.webp "This is a sample image.")

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`js
    let message = 'Hello world';
    alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs / marked\`.

## Thanks
Big Thanks to [markdownlivepreview](https://markdownlivepreview.com/) who inspired me to make this project

`;
document.addEventListener("alpine:init", () => {
  Alpine.data("liveMD", () => ({
    isFocus: false,
    get isInMobileScreen() {
      return screen.width <= 768;
    },
    showBottomBar() {
      this.isFocus = true;
    },
    hideBottomBar() {
      this.isFocus = false;
    },
    text: Alpine.$persist(initText),
    get markedText() {
      return marked.parse(this.text);
    },
    scrollToBottom() {
      if (!Alpine.$data(scrollButton).isScrollToBottom) return;
      content.scrollTo(0, content.scrollHeight);
    },
    setBold() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      isSelectCharacter = start !== end;
      charBefore = this.text.slice(start - 2, start) === "__";
      charAfter = this.text.slice(end, end + 2) === "__";
      isInBoldMode = charBefore && charAfter;
      if (isInBoldMode) {
        this.text =
          this.text.slice(0, start - 2) +
          this.text.slice(start, end) +
          this.text.slice(end + 2);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start - 2, end - 2);
        });
        return;
      }
      if (isSelectCharacter) {
        selectedText = this.text.substring(start, end);
        boldText = "__" + selectedText + "__";
        this.text = this.text.slice(0, start) + boldText + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 2, end + 2);
        });
      } else {
        this.text = this.text.slice(0, start) + "____" + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 2, end + 2);
        });
      }
    },
    setItalic() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      isSelectCharacter = start !== end;
      charBefore =
        this.text.slice(start - 1, start) === "_" &&
        this.text.slice(start - 2, start - 1) !== "_";
      charAfter =
        this.text.slice(end, end + 1) === "_" &&
        this.text.slice(end + 1, end + 2) !== "_";
      isInItalicMode = charBefore && charAfter;
      isInBoldItalicMode =
        this.text.slice(start - 3, start) === "___" &&
        this.text.slice(end, end + 3) === "___";
      if (isInItalicMode || isInBoldItalicMode) {
        this.text =
          this.text.slice(0, start - 1) +
          this.text.slice(start, end) +
          this.text.slice(end + 1);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start - 1, end - 1);
        });
        return;
      }
      if (isSelectCharacter) {
        selectedText = this.text.substring(start, end);
        italicText = "_" + selectedText + "_";
        this.text =
          this.text.slice(0, start) + italicText + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      } else {
        this.text = this.text.slice(0, start) + "__" + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      }
    },
    setQuote() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      textBefore = this.text.slice(0, start);
      lastEnter = textBefore.lastIndexOf("\n");
      firstCharacterInLine = textBefore.at(lastEnter + 1);
      isInQuoteMode = firstCharacterInLine === ">";
      if (isInQuoteMode) {
        this.text =
          this.text.slice(0, lastEnter + 1) + this.text.slice(lastEnter + 3);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start - 2, end - 2);
        });
      } else {
        this.text =
          this.text.slice(0, lastEnter + 1) +
          "> " +
          this.text.slice(lastEnter + 1);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 2, end + 2);
        });
      }
    },
    setHeading(level) {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      textBefore = this.text.slice(0, start);
      lastEnter = textBefore.lastIndexOf("\n");
      firstCharacterInLine = textBefore.at(lastEnter + 1);
      isInHeadingMode = firstCharacterInLine === "#";
      if (isInHeadingMode) {
        numberOfHashtag = 0;
        firstFourCharacterInLine = this.text.slice(
          lastEnter + 1,
          lastEnter + 5
        );
        for (const char of firstFourCharacterInLine) {
          if (char !== "#") break;
          if (char === "#") numberOfHashtag++;
        }
        if (numberOfHashtag === level) {
          this.text =
            this.text.slice(0, lastEnter + 1) +
            this.text.slice(lastEnter + 3 + (numberOfHashtag - 1));
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(
              start - 2 - (numberOfHashtag - 1),
              end - 2 - (numberOfHashtag - 1)
            );
          });
        } else {
          selisih = numberOfHashtag - level;
          this.text =
            this.text.slice(0, lastEnter + 1) +
            this.text.slice(lastEnter + 3 + (numberOfHashtag - 1));
          this.text =
            this.text.slice(0, lastEnter + 1) +
            "#".repeat(level) +
            " " +
            this.text.slice(lastEnter + 1);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start - selisih, end - selisih);
          });
        }
      } else {
        this.text =
          this.text.slice(0, lastEnter + 1) +
          "#".repeat(level) +
          " " +
          this.text.slice(lastEnter + 1);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + level + 1, end + level + 1);
        });
      }
    },
    setTab() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      this.text = this.text.slice(0, start) + "     " + this.text.slice(end);
      this.$nextTick(() => {
        editor.focus();
        editor.setSelectionRange(start + 5, start + 5);
      });
    },
    setInlineCode() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      isSelectCharacter = start !== end;
      charBefore = this.text.slice(start - 1, start) === "`";
      charAfter = this.text.slice(end, end + 1) === "`";
      isInInlineCodeMode = charBefore && charAfter;
      if (isInInlineCodeMode) {
        this.text =
          this.text.slice(0, start - 1) +
          this.text.slice(start, end) +
          this.text.slice(end + 1);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start - 1, end - 1);
        });
        return;
      }
      if (isSelectCharacter) {
        selectedText = this.text.substring(start, end);
        inlineCodeText = "`" + selectedText + "`";
        this.text =
          this.text.slice(0, start) + inlineCodeText + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      } else {
        this.text = this.text.slice(0, start) + "``" + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      }
    },
    setLink() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      isSelectCharacter = start !== end;
      if (isSelectCharacter) {
        selectedText = this.text.substring(start, end);
        angleBracketsText = "[" + selectedText + "]()";
        this.text =
          this.text.slice(0, start) + angleBracketsText + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, start + 1 + selectedText.length);
        });
      } else {
        this.text = this.text.slice(0, start) + "[]()" + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      }
    },
    setImage() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      isSelectCharacter = start !== end;
      if (isSelectCharacter) {
        selectedText = this.text.substring(start, end);
        angleBracketsText = "![" + selectedText + "]()";
        this.text =
          this.text.slice(0, start) + angleBracketsText + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 2, start + 2 + selectedText.length);
        });
      } else {
        this.text = this.text.slice(0, start) + "![]()" + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 2, end + 2);
        });
      }
    },
    setHorizontalRule() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      cursor = 6;
      if (this.text.slice(start - 1, start) === "\n") {
        horizontalRuleText = "\n---\n\n";
      } else {
        horizontalRuleText = "\n\n---\n\n";
        cursor += 1;
      }
      this.text =
        this.text.slice(0, start) + horizontalRuleText + this.text.slice(end);
      this.$nextTick(() => {
        editor.focus();
        editor.setSelectionRange(end + cursor, end + cursor);
      });
    },
    setTable() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      preText = "";
      table = `| Default columns | Left columns | Center columns | Right columns |\n| --- | :--- | :---: | ---:|\n| default foo | left foo | center foo | right foo |\n| default bar | left bar | center bar | right bar |\n\n`;

      if (this.text.slice(start - 1, start) !== "\n") {
        preText = "\n\n";
      }
      this.text =
        this.text.slice(0, start) + preText + table + this.text.slice(end);
      this.$nextTick(() => {
        editor.focus();
        editor.setSelectionRange(start + table.length, start + table.length);
      });
    },
    setList(isOrderedList = false) {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      textBefore = this.text.slice(0, start);
      lastEnter = textBefore.lastIndexOf("\n");
      firstCharacterInLine = textBefore.at(lastEnter + 1);
      if (isOrderedList) {
        isInListMode = firstCharacterInLine === "1";
        if (isInListMode) {
          this.text =
            this.text.slice(0, lastEnter + 1) + this.text.slice(lastEnter + 4);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start - 3, end - 3);
          });
        } else {
          this.text =
            this.text.slice(0, lastEnter + 1) +
            "1. " +
            this.text.slice(lastEnter + 1);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start + 3, end + 3);
          });
        }
      } else {
        isInListMode = firstCharacterInLine === "-";
        if (isInListMode) {
          this.text =
            this.text.slice(0, lastEnter + 1) + this.text.slice(lastEnter + 3);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start - 2, end - 2);
          });
        } else {
          this.text =
            this.text.slice(0, lastEnter + 1) +
            "- " +
            this.text.slice(lastEnter + 1);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start + 2, end + 2);
          });
        }
      }
    },
    handleEnter() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      textBefore = this.text.slice(0, start);
      lastEnter = textBefore.lastIndexOf("\n");
      firstCharacterInLine = textBefore.at(lastEnter + 1);

      isInListMode =
        firstCharacterInLine === "1" || firstCharacterInLine === "-";
      if (isInListMode) {
        isOrdered = this.text.slice(lastEnter + 1, lastEnter + 2) === "1";
        if (isOrdered) {
          this.text =
            this.text.slice(0, start) + "\n1. " + this.text.slice(end);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start + 4, start + 4);
          });
        } else {
          this.text = this.text.slice(0, start) + "\n- " + this.text.slice(end);
          this.$nextTick(() => {
            editor.focus();
            editor.setSelectionRange(start + 3, start + 3);
          });
        }
      }
    },
    setStrikethrough() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      isSelectCharacter = start !== end;
      charBefore = this.text.slice(start - 1, start) === "~";
      charAfter = this.text.slice(end, end + 1) === "~";
      isInInlineCodeMode = charBefore && charAfter;
      if (isInInlineCodeMode) {
        this.text =
          this.text.slice(0, start - 1) +
          this.text.slice(start, end) +
          this.text.slice(end + 1);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start - 1, end - 1);
        });
        return;
      }
      if (isSelectCharacter) {
        selectedText = this.text.substring(start, end);
        inlineCodeText = "~" + selectedText + "~";
        this.text =
          this.text.slice(0, start) + inlineCodeText + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      } else {
        this.text = this.text.slice(0, start) + "~~" + this.text.slice(end);
        this.$nextTick(() => {
          editor.focus();
          editor.setSelectionRange(start + 1, end + 1);
        });
      }
    },
    setBlockCode() {
      start = editor.selectionStart;
      end = editor.selectionEnd;
      preText = "";
      table = `\`\`\`\n\n\`\`\`\n\n`;

      if (this.text.slice(start - 1, start) !== "\n") {
        preText = "\n\n";
        console.log(preText.length);
      }
      this.text =
        this.text.slice(0, start) + preText + table + this.text.slice(end);
      this.$nextTick(() => {
        editor.focus();
        editor.setSelectionRange(
          start + 4 + preText.length,
          start + 4 + preText.length
        );
      });
    },
  }));
});
