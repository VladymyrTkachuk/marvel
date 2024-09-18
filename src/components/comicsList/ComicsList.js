import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import useMarvelService from "../../services/MarvelService";

import "./comicsList.scss";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
      break;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
      break;
    case "confirmet":
      return <Component />;
      break;
    case "error":
      return <ErrorMessage />;
      break;
    default:
      new Error("Unexpected process state");
  }
};

const ComicsList = (props) => {
  const [comList, setComList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [comEndet, setComEndet] = useState(false);

  const { loading, error, getAllComics, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllComics(offset)
      .then(onComListLoaded)
      .then(() => setProcess("confirmet"));
  };

  const onComListLoaded = (newComList) => {
    let ended = false;
    if (newComList.length < 8) {
      ended = true;
    }

    setComList((comList) => [...comList, ...newComList]);
    setNewItemLoading(false);
    setOffset(offset + 8);
    setComEndet(ended);
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
        <li className="comics__item" key={i}>
          <NavLink to={`/comics/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </NavLink>
        </li>
      );
    });
    return <ul className="comics__grid">{items}</ul>;
  }

  return (
    <div className="comics__list">
      {setContent(process, () => renderItems(comList), newItemLoading)}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comEndet ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
