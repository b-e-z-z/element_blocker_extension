let css_element = null;
let block_rules = null; 
let rule = null;
let blocked_classes = [];

function update_css() {
  if (css_element) {
    css_element.remove();
  }

  chrome.storage.sync.get('block_rules', function(data) {
    block_rules = data.block_rules;

    if (block_rules) {
      rule = get_rule(block_rules);

      if (rule && rule.enabled) {
        blocked_classes = rule.blocked_classes;

        css_element = document.createElement('style');
        document.head.appendChild(css_element);
        
        let css = get_css(rule);
        
        css_element.appendChild(document.createTextNode(css));
      }
    }
  });
}

function get_rule(rules) {
  for(let r = 0; r < rules.length; r++) {
    let rule = rules[r];
    if (document.URL.includes(rule.url)) {
      return rule;
    }
  }
}

function get_css(rule) {
  let css = "";

  for(let c = 0; c < rule.blocked_classes.length; c++) {
    let blocked_class = rule.blocked_classes[c];
    if (blocked_class.enabled) {
      let blocker = blocked_class.class + " { display: none !important; } ";
      css = css + blocker;
    }
  }

  return css;
}

chrome.runtime.onMessage.addListener(
  function(message) {
    switch(message.type) {
      case "update_css":
        update_css();
        break;
    }
  }
);

update_css();