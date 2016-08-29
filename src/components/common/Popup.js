/**
 * Created by ravi.hamsa on 7/2/16.
 */
import React, {PropTypes, Component} from 'react';

let popupStyles = {
}

let bodyStyles = {
    position: 'absolute',
    left:'50%',
    top:'50%',
    transform:'translateX(-50%) translateY(-50%)',
    zIndex: 999,

}
let maskStyles = {
    position: 'absolute',
    backgroundColor:'rgba(0,0,0,0.5)',
    left:0,
    top:0,
    right:0,
    bottom:0
}

let popupContainerStyles = {
    position: 'fixed',
    zIndex: 998,
    backgroundColor:'rgba(0,0,0,0.5)',
    left:0,
    top:0,
    right:0,
    bottom:0
}

let openPopup;

class Popup extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            open: false
        }
    }

    openPopup() {
        this.setState({open: true})
    }

    closePopup() {
        this.setState({open: false})
    }

    togglePopup() {
        this.state.open ? this.closePopup() : this.openPopup();
    }

    itemClick() {
        if (this.props.itemClick) {
            this.props.itemClick(arguments);
        }
    }

    render() {
        let childProps = {
            togglePopup: this.togglePopup.bind(this),
            closePopup: this.closePopup.bind(this),
            itemClick: this.itemClick.bind(this),
            isOpen: this.state.open,
            isModal: this.props.isModal
        }

        console.log(this.state.open, '*****122')

        return <div styles={popupStyles} {...this.props}>
            {this.props.children.map(function (children, index) {
                return React.cloneElement(children, {...childProps, key: index})
            })}
        </div>
    }
}

Popup.defaultProps = {
    isModal:true
}


class PopupButton extends Component {
    render() {
        return React.cloneElement(this.props.children, {onClick: this.props.togglePopup})
    }
}

class PopupBody extends Component {
    maskClick(){
        if(this.props.isModal){
            this.props.closePopup();
        }
    }

    render() {
        console.log(this.props.isOpen, '******')


        if(this.props.isOpen){
            return <div style={popupContainerStyles}>
                <div style={maskStyles} onClick={this.maskClick.bind(this)}>
                </div>
                <div
                    style={bodyStyles}> { React.cloneElement(this.props.children, {closePopup: this.props.closePopup}) }</div>
            </div>
        }else{
            return <div></div>
        }
    }
}

export default {
    Popup,
    PopupButton,
    PopupBody
}