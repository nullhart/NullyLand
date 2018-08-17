<template>
    <v-container>
        <v-flex xs12>
            <h1 class="text-xs-center" editable>{{post.title}}</h1>
            <vue-markdown :source="post.markdown"></vue-markdown>
        </v-flex>
    </v-container>
</template>

<script>
import VueMarkdown from "vue-markdown";

import marked from "marked";

export default {
  name: "Post",
  components: { VueMarkdown, marked },
  data() {
    return {
      mounted: false,
      post: {
        id: 1,
        dateCreated: new Date(),
        title: "Raspberry Pi Router!",
        markdown: `
---
__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You will like those projects!

---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'




      
        `,
        links: []
      }
    };
  },

  methods: {
    compiledMarkdown: function(index) {
      console.log(index);
      return marked(this.post.content[index].text, { sanitize: false });
    }
  },
  computed: {}
};
</script>

<style scoped>
</style>
