'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RXFormElement2 = require('./RXFormElement');

var _RXFormElement3 = _interopRequireDefault(_RXFormElement2);

var _Month = require('../common/Month');

var _Month2 = _interopRequireDefault(_Month);

var _InlineModalGroup = require('../common/InlineModalGroup');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('../../core/utils');

var _utils2 = _interopRequireDefault(_utils);

var _RXDatePicker = require('./RXDatePicker');

var _RXDatePicker2 = _interopRequireDefault(_RXDatePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dateRangeSplitter = '<=>';

var RXDateRangePicker = function (_RXFormElement) {
    _inherits(RXDateRangePicker, _RXFormElement);

    function RXDateRangePicker() {
        _classCallCheck(this, RXDateRangePicker);

        return _possibleConstructorReturn(this, (RXDateRangePicker.__proto__ || Object.getPrototypeOf(RXDateRangePicker)).apply(this, arguments));
    }

    _createClass(RXDateRangePicker, [{
        key: 'getDefaultDate',
        value: function getDefaultDate() {
            var _props = this.props,
                rangeDuration = _props.rangeDuration,
                rangeUnit = _props.rangeUnit;

            var inputFormat = _utils2.default.getStarterConfig('dateFormat');
            return (0, _moment2.default)().format(inputFormat) + dateRangeSplitter + (0, _moment2.default)().add(rangeDuration, rangeUnit).format(inputFormat);
        }
    }, {
        key: 'onChange',
        value: function onChange(dateType, selectedDate) {
            var value = this.state.value || this.getDefaultDate();
            var valueArr = value.split(dateRangeSplitter);
            if (dateType === 'from') {
                valueArr[0] = selectedDate;
            } else if (dateType === 'to') {
                valueArr[1] = selectedDate;
            }
            this.updateValue(valueArr.join(dateRangeSplitter), 'update');
        }
    }, {
        key: 'closePopup',
        value: function closePopup(dateType) {
            if (this['ref_modal_' + dateType]) {
                this['ref_modal_' + dateType].closePopup();
            }
        }
    }, {
        key: 'renderElement',
        value: function renderElement() {
            var _this2 = this;

            var props = this.filterDomProps(this.props);
            var inputFormat = _utils2.default.getStarterConfig('dateFormat');
            props.className = 'form-control';
            props.readOnly = true;
            props.value = this.state.value || this.getDefaultDate();
            var valueArr = props.value.split(dateRangeSplitter);
            var _props2 = this.props,
                valign = _props2.valign,
                bodyPosition = _props2.bodyPosition,
                _props2$bodyClassName = _props2.bodyClassName,
                bodyClassName = _props2$bodyClassName === undefined ? '' : _props2$bodyClassName,
                _props2$minDate = _props2.minDate,
                minDate = _props2$minDate === undefined ? (0, _moment2.default)().format(inputFormat) : _props2$minDate,
                _props2$maxDate = _props2.maxDate,
                maxDate = _props2$maxDate === undefined ? (0, _moment2.default)().add(10, 'years').format(inputFormat) : _props2$maxDate;


            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _InlineModalGroup.InlineModal,
                    { ref: function ref(modal) {
                            return _this2.ref_modal_from = modal;
                        } },
                    _react2.default.createElement(
                        _InlineModalGroup.InlineModalButton,
                        null,
                        _react2.default.createElement(
                            'div',
                            null,
                            _react2.default.createElement(
                                'span',
                                props,
                                valueArr[0]
                            ),
                            _react2.default.createElement('span', { className: 'calendar icon' })
                        )
                    ),
                    _react2.default.createElement(
                        _InlineModalGroup.InlineModalBody,
                        { valign: valign, bodyPosition: bodyPosition, className: bodyClassName },
                        _react2.default.createElement(_Month2.default, { onDateSelect: this.onChange.bind(this, 'from'), selectedDate: valueArr[0],
                            displayDate: valueArr[0],
                            minDate: minDate, maxDate: valueArr[1],
                            closePopup: this.closePopup.bind(this, 'from') })
                    )
                ),
                _react2.default.createElement(
                    _InlineModalGroup.InlineModal,
                    { ref: function ref(modal) {
                            return _this2.ref_modal_to = modal;
                        } },
                    _react2.default.createElement(
                        _InlineModalGroup.InlineModalButton,
                        null,
                        _react2.default.createElement(
                            'div',
                            null,
                            _react2.default.createElement(
                                'span',
                                props,
                                valueArr[1]
                            ),
                            _react2.default.createElement('span', { className: 'calendar icon' })
                        )
                    ),
                    _react2.default.createElement(
                        _InlineModalGroup.InlineModalBody,
                        { valign: valign, bodyPosition: bodyPosition, className: bodyClassName },
                        _react2.default.createElement(_Month2.default, { onDateSelect: this.onChange.bind(this, 'to'), selectedDate: valueArr[1],
                            displayDate: valueArr[1],
                            minDate: valueArr[0], maxDate: maxDate,
                            closePopup: this.closePopup.bind(this, 'to') })
                    )
                )
            );
        }
    }]);

    return RXDateRangePicker;
}(_RXFormElement3.default);

exports.default = RXDateRangePicker;


RXDateRangePicker.defaultProps = _extends({}, _RXFormElement3.default.defaultProps, {
    type: 'date-picker',
    bodyPosition: 'down',
    rangeDuration: 1,
    rangeUnit: 'month'
});