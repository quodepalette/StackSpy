// JoErl StackSpy — data bootstrap.
// `r` is String.raw so regexes can be written without doubling every backslash.
// `T(name, category, website, spec)` registers one technology in the knowledge base.
(function (g) {
  g.r = String.raw;
  g.TECH_DB = g.TECH_DB || [];
  g.T = function (name, cat, website, spec) {
    g.TECH_DB.push(Object.assign({ name: name, cat: cat, website: website }, spec || {}));
  };
})(typeof self !== "undefined" ? self : globalThis);
