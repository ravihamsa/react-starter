/**
 * Created by ravi.hamsa on 6/29/16.
 */

import React, {PropTypes, Component} from "react";
import FormElement from './FormElement';



class TextInput extends FormElement {
    render() {
        let defaultValue = this.getDefaultValue();
        let formClasses = this.getFormClasses();
        let value = defaultValue || '';
        let errors = this.getErrors();

        return <fieldset className={formClasses}>
            {this.props.showLabel ? <label>{this.props.label}</label> : null}
            <input type={this.props.type} className="form-control" name={this.props.name}
                   placeholder={this.props.placeholder} onChange={this.onChange.bind(this)}
                   disabled={this.props.disabled}
                   value={value}/>
            {this.props.helperText ? <small className="text-muted">{this.props.helperText}</small> : '' }
            {errors.length > 0 ? <small className="text-danger">{errors[0].message}</small> : '' }
        </fieldset>
    }
}


export default TextInput;
