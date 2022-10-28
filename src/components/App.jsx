import { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchImages } from 'services/api';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    page: 1,
    per_page: 12,
    error: null,
    isLoading: false,
    showModal: false,
    largeImageURL: '',
    tags: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const prevSearchQuery = prevState.searchQuery;
    const nextSearchQuery = this.state.searchQuery;

    if (prevSearchQuery !== nextSearchQuery) {
      this.renderGallery();
      this.setState({ isLoading: true });
    }
  }

  renderGallery = async () => {
    const { searchQuery, page } = this.state;
    this.setState({ isLoading: true });

    try {
      const response = await fetchImages(searchQuery, page);

      const { hits, totalHits } = response;

      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
        page: page + 1,
      }));

      if (totalHits === 0) {
        const notifyError = () =>
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        return notifyError();
      }
    } catch (error) {
      this.setState({ error });
      const notifyError = () => toast.error('Oops... Something went wrong');
      return notifyError();
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onFormSubmit = searchQuery => {
    this.setState({ searchQuery, images: [], page: 1 });

    if (searchQuery === '') {
      const notifyError = () =>
        toast.error('Please enter what are you looking for ?');
      return notifyError();
    }
  };

  onLoadMore = () => {
    const { searchQuery, page } = this.state;
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
    this.renderGallery(searchQuery, page);
  };

  openModal = (largeImageURL, tags) => {
    this.toggleModal();
    this.setState({
      largeImageURL,
      tags,
    });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { images, isLoading, largeImageURL, tags, showModal } = this.state;

    return (
      <>
        <Searchbar onSubmit={this.onFormSubmit} />
        <Toaster position="top-center" />

        <ImageGallery images={images} onOpenModal={this.openModal} />

        {isLoading && <Loader />}

        {images.length >= 12 && <Button onClick={this.onLoadMore} />}

        {showModal && (
          <Modal
            onModalClick={this.toggleModal}
            largeImage={largeImageURL}
            altTag={tags}
          />
        )}
      </>
    );
  }
}
