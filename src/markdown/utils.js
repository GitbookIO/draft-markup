const { Map } = require('immutable');
const entities = require('html-entities');
const { escapeWith, unescapeWith } = require('../utils/escape');

const htmlEntities = new entities.AllHtmlEntities();
const xmlEntities = new entities.XmlEntities();

// Replacements for Markdown escaping
// See http://spec.commonmark.org/0.15/#backslash-escapes
const REPLACEMENTS = Map([
    [ '*', '\\*' ],
    [ '#', '\\#' ],
    // GitHub doesn't escape slashes, and render the backslash in that cause
    // [ '/', '\\/' ],
    [ '(', '\\(' ],
    [ ')', '\\)' ],
    [ '[', '\\[' ],
    [ ']', '\\]' ],
    [ '`', '\\`' ],
    [ '<', '&lt;' ],
    [ '>', '&gt;' ],
    [ '_', '\\_' ],
    [ '|', '\\|' ]
]);

/**
 * Escape markdown syntax
 * We escape only basic XML entities
 *
 * @param {String} str
 * @param {Boolean} escapeXML
 * @return {String}
 */
function escapeMarkdown(str, escapeXML) {
    str = escapeWith(REPLACEMENTS, str);
    return escapeXML === false ? str : xmlEntities.encode(str);
}

/**
 * Unescape markdown syntax
 * We unescape all entities (HTML + XML)
 *
 * @param {String} str
 * @return {String}
 */
function unescapeMarkdown(str) {
    str = unescapeWith(REPLACEMENTS, str);
    return htmlEntities.decode(str);
}


/**
 * Create a function to replace content in a regex
 * @param  {RegEx} regex
 * @param  {String} opt
 * @return {Function(String, String)}
 */
function replace(regex, opt) {
    regex = regex.source;
    opt = opt || '';

    return function self(name, val) {
        if (!name) return new RegExp(regex, opt);
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return self;
    };
}

/**
 * Resolve a reference (links and images) in a state.
 * @param  {State} state
 * @param  {String} refID
 * @return {Object} props?
 */
function resolveRef(state, refID) {
    const refs = state.getProp('refs');

    refID = refID
        .replace(/\s+/g, ' ')
        .toLowerCase();

    const data = refs.get(refID);
    if (!data) {
        return;
    }

    return Map(data).filter(Boolean);
}

module.exports = {
    escape: escapeMarkdown,
    unescape: unescapeMarkdown,
    replace,
    resolveRef
};
