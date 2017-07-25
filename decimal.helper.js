var decimalHelper = {
    constants: {
        DEFAULT_DECIMAL_SELECTOR: '.decimal',
        DEFAULT_DECIMAL_SEPARATOR: '.',
        DEFAULT_LOCAL_DECIMAL_CODE: 190,
    },
    regexNegative: {
        dd: /^\-{0,1}[1-9]{1}[0-9]*$/,
        dsd: /^\-{0,1}[1-9]{1}[0-9]*\.{1}[0-9]{1,}$/,
        zsd: /^\-{0,1}0{1}\.{1}[0-9]*[1-9]{1,}[0-9]*/,
        ddsdd: /^\-{0,1}[1-9]{1,}\.[0-9]*$/,
        sdd: /^\-{0,1}\.[\d]{1,}$/,
        zdd: /^\-{0,1}0{1,}[1-9]{1}[0-9]*$/
    },
    regexPositive: {
        empty: /^$/,
        z: /^0{1}$/,
        dd: /^[1-9]{1}[0-9]*$/,
        dsd: /^[1-9]{1}[0-9]*\.{1}[0-9]{1,}$/,
        zsd: /^0{1}\.{1}[0-9]*[1-9]{1,}[0-9]*$/,
        ddsdd: /^[1-9]{1,}\.[0-9]*$/,
        sdd: /^\.[\d]{1,}$/,
        zdd: /^0{1,}[1-9]{1}[0-9]*$/
    },
    options: {
        autoSetLocalSeparator: true,
        autoSetCorrectValues: true,
        allowNegatives: true,
        consoleLogErrors: false,
        autoRoundNumber: true,
    },
    decimalSelector: '',
    localDecimalSeparator: '',
    localDecimalCode: 0,
    percision: 2,
    init: function () {

        decimalHelper.initializeOptions();
        decimalHelper.registerListeners();
        decimalHelper.formatter.setValuesCorrectFormat();
        decimalHelper.updateRegexExpressions();
    },
    registerListeners: function () {

        decimalHelper.events.validateInput();
    },
    events: {
        validateInput: function () {

            var oldValue;

            $(decimalHelper.decimalSelector).focusin(function (e) {

                oldValue = $(this).val();
            }).focusout(function (e) {

                var newValue = $(this).val();
                var valid;

                valid = decimalHelper.validatePositiveRegexs(newValue);

                if (!valid && decimalHelper.options.allowNegatives) {

                    valid = decimalHelper.validateNegativeRegexs(newValue);
                }

                if (!valid) {

                    $(this).val(oldValue);
                } else {

                    $(this).val(decimalHelper.formatter.format(newValue));
                }
            });

        }
    },
    setLocalSeparator: function () {

        var n = parseFloat(3 / 2);
        n = n.toString().substring(1, 2);

        if (n === ',') {

            decimalHelper.localDecimalSeparator = ',';
            decimalHelper.localDecimalCode = 188;
        }
        else if (n === '.') {

            decimalHelper.localDecimalSeparator = '.';
            decimalHelper.localDecimalCode = 190;
        }

    },
    initializeOptions: function () {

        decimalHelper.decimalSelector = decimalHelper.constants.DEFAULT_DECIMAL_SELECTOR;
        decimalHelper.localDecimalSeparator = decimalHelper.constants.DEFAULT_DECIMAL_SEPARATOR;
        decimalHelper.localDecimalCode = decimalHelper.constants.DEFAULT_LOCAL_DECIMAL_CODE;

        if (decimalHelper.options.autoSetLocalSeparator) {

            decimalHelper.setLocalSeparator();
        }
        if (decimalHelper.options.autoSetCorrectValues) {

            decimalHelper.formatter.setValuesCorrectFormat();
        }
    },
    validateRegex: function (regex, value) {

        return regex.test(value);
    },
    validatePositiveRegexs: function (value) {

        var validExpressions = 0;

        $.each(decimalHelper.regexPositive, function (index, regex) {

            if (decimalHelper.validateRegex(regex, value)) {

                validExpressions++;
            }
        });

        return validExpressions > 0;
    },
    validateNegativeRegexs: function (value) {

        var validExpressions = 0;

        $.each(decimalHelper.regexNegative, function (index, regex) {

            if (decimalHelper.validateRegex(regex, value)) {

                validExpressions++;
            }
        });

        return validExpressions > 0;
    },
    formatter: {
        format: function (value) {

            var formattedValue;

            if (value == '') {

                return '0' + decimalHelper.localDecimalSeparator + '00';
            }
            else if (value.indexOf(decimalHelper.localDecimalSeparator) == 0) {

                formattedValue = '0' + value;
            }
            else if (value.indexOf('-') == 0 && value.indexOf(decimalHelper.localDecimalSeparator) == 1) {

                formattedValue = value.replace('-', '-0');
            }
            else if (value.indexOf('0') == 0 && value.indexOf(decimalHelper.localDecimalSeparator) == -1 && value.length > 1) {

                formattedValue = value.replace('0', '0' + decimalHelper.localDecimalSeparator);
            }
            else if (value.indexOf('-') == 0 && value.indexOf('0') == 1 && value.indexOf(decimalHelper.localDecimalSeparator) == -1) {

                formattedValue = value.replace('-0', '-0' + decimalHelper.localDecimalSeparator);
            }
            else {

                return decimalHelper.formatter.roundValue(value);
            }

            return decimalHelper.formatter.roundValue(formattedValue);
        },
        setValuesCorrectFormat: function () {

            var decimalValues = $(decimalHelper.decimalSelector);

            $.each(decimalValues, function (index, value) {

                var decimalValue = $(value).val().toString().replace(',', decimalHelper.localDecimalSeparator);
                $(value).val(decimalValue);

                decimalValue = $(value).val().toString().replace('.', decimalHelper.localDecimalSeparator);
                $(value).val(decimalValue);

            });

        },
        roundValue: function (value) {

            var roundedValue;

            if (decimalHelper.options.autoRoundNumber) {

                roundedValue = parseFloat(value).toFixed(decimalHelper.percision).toString();

                if (/^\-0\.0*$/.test(roundedValue)) {

                    roundedValue = roundedValue.replace('-', '');
                }

                return roundedValue;
            }
            else {

                return value;
            }
        }
    },
    updateRegexExpressions: function () {

        //Negative regex

        decimalHelper.regexNegative.dsd = new RegExp('^\\-{0,1}[1-9]{1}[0-9]*\\' + decimalHelper.localDecimalSeparator + '{1}[0-9]{1,}$');

        decimalHelper.regexNegative.zsd = new RegExp('^\\-{0,1}0{1}\\' + decimalHelper.localDecimalSeparator + '{1}[0-9]*[1-9]{1,}[0-9]*');

        decimalHelper.regexNegative.ddsdd = new RegExp('^\\-{0,1}[1-9]{1,}\\' + decimalHelper.localDecimalSeparator + '[0-9]*$');

        decimalHelper.regexNegative.sdd = new RegExp('^\\-{0,1}\\' + decimalHelper.localDecimalSeparator + '[\\d]{1,}$');

        //Positive regex

        decimalHelper.regexPositive.dsd = new RegExp('^[1-9]{1}[0-9]*\\' + decimalHelper.localDecimalSeparator + '{1}[0-9]{1,}$');

        decimalHelper.regexPositive.zsd = new RegExp('^0{1}\\' + decimalHelper.localDecimalSeparator + '{1}[0-9]*[1-9]{1,}[0-9]*$');

        decimalHelper.regexPositive.ddsdd = new RegExp('^[1-9]{1,}\\' + decimalHelper.localDecimalSeparator + '[0-9]*$');

        decimalHelper.regexPositive.sdd = new RegExp('^\\' + decimalHelper.localDecimalSeparator + '[\\d]{1,}$');
    }
}