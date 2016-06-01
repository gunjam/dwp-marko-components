'use strict';

require('marko/node-require').install();

const marko = require('marko');
const cheerio = require('cheerio');
const {expect, assert} = require('chai');
let tc;

describe('<dwp-checkboxes/>', () => {
  beforeEach(() => {
    tc += '.';
  });

  it('should error if you don\'t supply a name attribute', () => {
    const templateSrc =
      `<dwp-checkboxes legend="Favourite colour?">
         <dwp-checkboxes:checkbox label="Red" value="red"/>
         <dwp-checkboxes:checkbox label="Blue" value="blue"/>
       </dwp-checkboxes>`;

    try {
      marko.load(tc, templateSrc);
    } catch (error) {
      return assert(true);
    }

    assert(false, 'missing attribute "name" did not throw an error');
  });

  it('should error if you don\'t supply a legend attribute', () => {
    const templateSrc =
      `<dwp-checkboxes name="colour">
         <dwp-checkboxes:checkbox label="Red" value="red"/>
         <dwp-checkboxes:checkbox label="Blue" value="blue"/>
       </dwp-checkboxes>`;

    try {
      marko.load(tc, templateSrc);
    } catch (error) {
      return assert(true);
    }

    assert(false, 'missing attribute "legend" did not throw an error');
  });

  it('should render the correct markup', () => {
    const templateSrc =
      '<dwp-checkboxes name="colour" legend="Favourite colour?"/>';

    const output = marko.load(tc, templateSrc).renderSync({});

    expect(output).to.equal(
      '<div class="form-group">' +
        '<fieldset>' +
          '<legend>' +
            '<span class="visuallyhidden">Favourite colour?</span>' +
          '</legend>' +
        '</fieldset>' +
      '</div>'
    );
  });

  it('should add error message and classes when passed an error object', () => {
    const templateSrc =
      `<dwp-checkboxes legend=data.legend name=data.name error=data.error>
         <dwp-checkboxes:checkbox label=value=data.checkboxes[0].label
           value=data.checkboxes[0].value/>
         <dwp-checkboxes:checkbox label=value=data.checkboxes[1].label
           value=data.checkboxes[1].value/>
       </dwp-checkboxes>`;

    const data = {
      legend: 'Favourite colour?',
      name: 'colour',
      checkboxes: [
        {label: 'Red', value: 'red'},
        {label: 'Blue', value: 'blue'}
      ],
      error: {
        msg: 'Please pick a colour'
      }
    };

    const output = marko.load(tc, templateSrc).renderSync(data);
    const $ = cheerio.load(output);
    const formGroupClasses = $('.form-group').attr('class');
    const error = $('legend > span.visuallyhidden + span.error-message').text();
    const errorId = $('.error-message').attr('id');

    expect(formGroupClasses).to.equal('form-group error');
    expect(error).to.equal(data.error.msg);
    expect(errorId).to.equal(`error-message-${data.name}`);
  });

  it('should check boxes which have values in the values array attr', () => {
    const templateSrc =
      `<dwp-checkboxes legend=data.legend name=data.name values=data.values>
         <dwp-checkboxes:checkbox label=value=data.checkboxes[0].label
           value=data.checkboxes[0].value/>
         <dwp-checkboxes:checkbox label=value=data.checkboxes[1].label
           value=data.checkboxes[1].value/>
         <dwp-checkboxes:checkbox label=value=data.checkboxes[2].label
           value=data.checkboxes[2].value/>
       </dwp-checkboxes>`;

    const data = {
      legend: 'Favourite colour?',
      name: 'colour',
      checkboxes: [
        {label: 'Red', value: 'red'},
        {label: 'Blue', value: 'blue'},
        {label: 'Green', value: 'green'}
      ],
      values: ['red', 'green']
    };

    const output = marko.load(tc, templateSrc).renderSync(data);

    expect(output).to.equal(
      '<div class="form-group">' +
        '<fieldset>' +
          '<legend>' +
            '<span class="visuallyhidden">Favourite colour?</span>' +
          '</legend>' +
          '<label for="checkbox-colour-0" class="block-label">' +
            '<input id="checkbox-colour-0" name="colour" value="red" ' +
              'type="checkbox" checked="checked">' +
            'Red' +
          '</label>' +
          '<label for="checkbox-colour-1" class="block-label">' +
            '<input id="checkbox-colour-1" name="colour" value="blue" ' +
              'type="checkbox">' +
            'Blue' +
          '</label>' +
          '<label for="checkbox-colour-2" class="block-label">' +
            '<input id="checkbox-colour-2" name="colour" value="green" ' +
              'type="checkbox" checked="checked">' +
            'Green' +
          '</label>' +
        '</fieldset>' +
      '</div>'
    );
  });

  describe('<dwp-checkboxes:dwp-checkbox/>', () => {
    it('should error if you don\'t supply a label attribute', () => {
      const templateSrc =
        `<dwp-checkboxes legend="Favourite colour?" name="colour">
           <dwp-checkboxes:checkbox value="red"/>
           <dwp-checkboxes:checkbox label="Blue" value="blue"/>
         </dwp-checkboxes>`;

      try {
        marko.load(tc, templateSrc);
      } catch (error) {
        return assert(true);
      }

      assert(false, 'missing attribute "label" did not throw an error');
    });

    it('should error if you don\'t supply a value attribute', () => {
      const templateSrc =
        `<dwp-checkboxes legend="Favourite colour?" name="colour">
           <dwp-checkboxes:checkbox label="Red"/>
           <dwp-checkboxes:checkbox label="Blue" value="blue"/>
         </dwp-checkboxes>`;

      try {
        marko.load(tc, templateSrc);
      } catch (error) {
        return assert(true);
      }

      assert(false, 'missing attribute "value" did not throw an error');
    });

    it('should render the correct markup', () => {
      const templateSrc =
        `<dwp-checkboxes legend=data.legend name=data.name>
           <dwp-checkboxes:checkbox value=data.checkboxes[0].value
             label=data.checkboxes[0].label/>
           <dwp-checkboxes:checkbox value=data.checkboxes[1].value
             label=data.checkboxes[1].label/>
         </dwp-checkboxes>`;

      const data = {
        legend: 'Favourite colour?',
        name: 'colour',
        checkboxes: [
          {label: 'Red', value: 'red'},
          {label: 'Blue', value: 'blue'}
        ]
      };

      const output = marko.load(tc, templateSrc).renderSync(data);

      expect(output).to.equal(
        '<div class="form-group">' +
          '<fieldset>' +
            '<legend>' +
              '<span class="visuallyhidden">Favourite colour?</span>' +
            '</legend>' +
            '<label for="checkbox-colour-0" class="block-label">' +
              '<input id="checkbox-colour-0" name="colour" value="red" ' +
                'type="checkbox">' +
              'Red' +
            '</label>' +
            '<label for="checkbox-colour-1" class="block-label">' +
              '<input id="checkbox-colour-1" name="colour" value="blue" ' +
                'type="checkbox">' +
              'Blue' +
            '</label>' +
          '</fieldset>' +
        '</div>'
      );
    });

    it('should set the ID as checkbox-${name}-${index} if no ID attr', () => {
      const templateSrc =
        `<dwp-checkboxes legend=data.legend name=data.name>
           <dwp-checkboxes:checkbox value=data.checkbox.value
             label=data.checkbox.label/>
         </dwp-checkboxes>`;

      const data = {
        legend: 'Favourite colour?',
        name: 'colour',
        checkbox: {label: 'Red', value: 'red'}
      };

      const output = marko.load(tc, templateSrc).renderSync(data);
      const $ = cheerio.load(output);
      const inputId = $('input[value=red]').attr('id');

      expect(inputId).to.equal(`checkbox-${data.name}-0`);
    });

    it('should use ID attribute value over generated ID', () => {
      const templateSrc =
        `<dwp-checkboxes legend=data.legend name=data.name>
           <dwp-checkboxes:checkbox value=data.checkbox.value
             id=data.checkbox.id label=data.checkbox.label/>
         </dwp-checkboxes>`;

      const data = {
        legend: 'Favourite colour?',
        name: 'colour',
        checkbox: {label: 'Red', value: 'red', id: 'my-checkbox'}
      };

      const output = marko.load(tc, templateSrc).renderSync(data);
      const $ = cheerio.load(output);
      const inputId = $('input[value=red]').attr('id');

      expect(inputId).to.equal(data.checkbox.id);
    });

    it('should add a form hint using the hint attribute', () => {
      const templateSrc =
        `<dwp-checkboxes legend=data.legend name=data.name>
           <dwp-checkboxes:checkbox value=data.checkbox.value
             hint=data.checkbox.hint label=data.checkbox.label/>
         </dwp-checkboxes>`;

      const data = {
        legend: 'Favourite colour?',
        name: 'colour',
        checkbox: {label: 'Red', value: 'red', hint: 'Blood is this colour'}
      };

      const output = marko.load(tc, templateSrc).renderSync(data);

      expect(output).to.equal(
        '<div class="form-group">' +
          '<fieldset>' +
            '<legend>' +
              '<span class="visuallyhidden">Favourite colour?</span>' +
            '</legend>' +
            '<label for="checkbox-colour-0" class="block-label">' +
              '<input id="checkbox-colour-0" name="colour" value="red" ' +
                'type="checkbox">' +
              '<span class="heading-small">Red</span><br>' +
              'Blood is this colour' +
            '</label>' +
          '</fieldset>' +
        '</div>'
      );
    });
  });
});
