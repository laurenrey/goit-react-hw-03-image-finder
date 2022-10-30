import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (hits.length > 1 && hits.length < 12) {
        setTimeout(() => {
          toast.info('These are all possible search results.', {
            autoClose: 5000,
          });
        }, 1500);
      }
    } catch (error) {
      this.setState({ error });
      toast.error('Oops... Something went wrong');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onFormSubmit = searchQuery => {
    this.setState({ searchQuery, images: [], page: 1 });
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
        <ToastContainer autoClose={4000} />

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
