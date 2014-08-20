/** A helper function to handlebars
 *
 * @param name Template name
 * @returns {*} The promise object with template function as the parameter of done callback
 */
Handlebars.getTemplate = function(name) {
    if (Handlebars.templates === undefined){
        Handlebars.templates = {};
    }
    if (Handlebars.templates[name] === undefined) {
        return $.get('/templates/' + name + '.hbs')
            .then(function(data,textStatus,jqXHR) {
                return Handlebars.templates[name] = Handlebars.compile(jqXHR.responseText);
            });
    }else{
        return $.when(Handlebars.templates[name]);
    }
};