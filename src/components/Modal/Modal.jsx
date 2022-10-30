import { Component } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ModalWindow } from './Modal.styled';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.onModalClick();
    }
  };

  onBackDropClick = e => {
    if (e.target === e.currentTarget) {
      this.props.onModalClick();
    }
  };

  render() {
    const { onModalClick, largeImage, altTag } = this.props;

    return (
      <Overlay onClick={() => onModalClick()}>
        <ModalWindow>
          <img src={largeImage} alt={altTag} />
        </ModalWindow>
      </Overlay>
    );
  }
}

Modal.prototypes = {
  altTag: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
