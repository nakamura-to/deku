var data = {
  header: function() {
    return "Colors";
  },
  item: [
    {name: "red", current: true, url: "#Red"},
    {name: "green", current: false, url: "#Green"},
    {name: "blue", current: false, url: "#Blue"}
  ],
  link: function(item) {
    return item.current !== true;
  },
  list: function() {
    return this.item.length !== 0;
  },
  empty: function() {
    return this.item.length === 0;
  }
};