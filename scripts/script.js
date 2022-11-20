import {
  getPaginatedNews,
  getNewsById,
  getAllNews,
  getUserComments,
  postComment,
  deleteComment,
  createNews,
  updateNews,
  updateComment,
  deleteNews,
} from "./networkRequests/api.js";

const loader = document.querySelector(".loading");

export const displayLoading = () => {
  loader.classList.remove("success");
  loader.classList.add("display");
  // to stop loading after some time
  setTimeout(() => {
    loader.classList.remove("display");
  }, 5000);
};

export const hideLoading = () => {
  loader.classList.remove("display");
  loader.classList.add("success");
};

// display news card info
const displayNewsCards = async (pageNumber, pageLimit) => {
  const container = document.querySelector(".container");
  const data = await getPaginatedNews(pageNumber, pageLimit);
  const newsHtmlcard = data
    .map((news) => {
      return `
            <div class="card" >
            <div class="card-img">
            <a href="../pages/details.html?id=${news.id}" class="img-link"><img src=${news.avatar} alt="image" class="img"></a> 
            </div>
            <div class="card-content">
                <h3 class="title"><a href="../pages/details.html?id=${news.id}">${news.title}</a></h3>
                <p class="url">Url: <a href=${news.url} target="_blank">${news.url}</a> </p>
            <div class="card-buttons">
                 <p class="author">Author: <span>${news.author}</span> </p>
                <div class="comment-format">
                    <a class="button-stlyed primary edit" href="../pages/edit.html?id=${news.id}">Edit</a>
                    <a class="button-stlyed primary delete" data-id=${news.id}>Delete</a>
                </div>
            </div>
                
            </div>
            </div>   
        `;
    })
    .join("");
    // container.innerHTML = newsHtmlcard
  container.insertAdjacentHTML("beforeend", newsHtmlcard);

  await handleDeleteNews()
};

const createNewsForm = async () => {
  const newsForm = document.querySelector("#create-news-form");
  const news = await getAllNews();

  newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newsForm);
    const payload = {
      id: Number(news.length + 1),
      author: formData.get("author"),
      avatar: formData.get("avatar"),
      title: formData.get("title"),
      url: formData.get("url"),
    };
    const data = await createNews(payload);
    if (data) {
      window.location.reload();
    }
  });
};

const editNewsForm = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const news = await getNewsById(id);
  const newsForm = document.querySelector("#edit-news-form");
  document.querySelector("input[name=author]").defaultValue = news.author;
  document.querySelector("input[name=avatar]").defaultValue = news.avatar;
  document.querySelector("input[name=title]").defaultValue = news.title;
  document.querySelector("input[name=url]").defaultValue = news.url;

  newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newsForm);
    const payload = {
      author: formData.get("author"),
      avatar: formData.get("avatar"),
      title: formData.get("title"),
      url: formData.get("url"),
    };
    const data = await updateNews(id, payload);
    if (data) {
      window.location.assign("../pages/home.html");
    }
  });
};

const handleDeleteNews = async () => {
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const newsId =
        e.target.getAttribute(
          "data-id"
        );
        console.log(newsId);
      await deleteNews(newsId);
      window.location.reload();
    });
  });
};

const handleHome = async () => {
  const paginationNumbers = document.querySelector("#pagination-numbers");
  const nextButton = document.querySelector("#next-button");
  const prevButton = document.querySelector("#prev-button");

  const data = await getAllNews();
  const totalNews = data.length;
  const paginationLimit = 10;
  const totalPages = Math.ceil(totalNews / paginationLimit);

  let currentPage = 1;
  
  

  const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
  };

  const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
  };

  const handlePageButtonsStatus = (currentPageNumber) => {
    currentPageNumber == 1
      ? disableButton(prevButton)
      : enableButton(prevButton);
    currentPageNumber === totalPages
      ? disableButton(nextButton)
      : enableButton(nextButton);
  };

  const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
  };

  const getPaginationNumbers = () => {
    for (let index = 1; index <= totalPages; index++) {
      const pageNumber = document.createElement("button");
      pageNumber.className = "pagination-number";
      pageNumber.innerHTML = index;
      pageNumber.setAttribute("page-index", index);
      paginationNumbers.appendChild(pageNumber);
    }
  };

  const setCurrentPage = (page_number) => {
    currentPage = page_number;
    handlePageButtonsStatus(currentPage);
    handleActivePageNumber();
    displayNewsCards(currentPage, paginationLimit);
  };

  const removeCardsFromDom = () => {
    const cards = document.querySelectorAll(".card");
    for (var i = cards.length - 1; i >= 0; i--) {
      cards[i].remove();
    }
  };

  getPaginationNumbers();
  setCurrentPage(1);
  

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      removeCardsFromDom();
      setCurrentPage(currentPage - 1);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      removeCardsFromDom();
      setCurrentPage(currentPage + 1);
      handleActivePageNumber();
      handlePageButtonsStatus();
    }
  });

  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        removeCardsFromDom();
        setCurrentPage(pageIndex);
        handleActivePageNumber();
      });
    }
  });

  await createNewsForm();
};

const handleNewsDetails = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const news = await getNewsById(id);
  const newsDetailsContainer = document.querySelector(
    ".news-details-container"
  );
  const newsDetails = `
          <h3 class="news-title">${news.title}</h3>
          <div class="news-details">
              <div class="news-img">
                  <img src=${news.avatar} alt="image" class="news-img">
              </div>
              <div class="news-content"
                  <p class="news-author">Author:  ${news.author}</p>  
                 
                  <p class="news-body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat nesciunt aliquam, mollitia doloremque obcaecati placeat animi veritatis cum laudantium cupiditate, explicabo eveniet nisi ullam officia alias fugit voluptate in impedit! <br>
                  <br>
                  Quasi cumque enim eum ex, asperiores maiores earum et iure modi id magni soluta. Quaerat vel placeat minima ipsum dolores exercitationem rerum impedit qui beatae, molestiae, rem mollitia, quas vero! 
                  <br>
                  <br>
                  Ipsam adipisci eveniet nisi amet provident. Distinctio molestiae commodi tempore, eius, aut sit corporis libero et veritatis non ducimus odit porro necessitatibus error perspiciatis cum possimus! Mollitia possimus error provident.
                  <br>
                  <br>
                  Soluta quaerat illo iste enim officia, harum magnam placeat consectetur voluptas recusandae dicta saepe maiores ab odio! Delectus tempore inventore sequi officiis voluptatibus soluta, repellendus minima. Pariatur commodi nisi corrupti?<br>
                  <br>
                  Neque, quasi? Quos odit cupiditate, vel perferendis laborum at laboriosam reprehenderit molestiae reiciendis ipsam tenetur impedit ducimus temporibus sapiente blanditiis numquam architecto, quasi voluptatum vero? Dolores soluta vel nisi! Aspernatur!
                  </p>
              </div>
          </div>
          `;
  newsDetailsContainer.insertAdjacentHTML("afterbegin", newsDetails);
  await handleShowComments(id);
  await showCommentsForm();
  await handleDeleteComment(id);
};

const handleShowComments = async (id) => {
  const comments = await getUserComments(id);
  const commentContainer = document.querySelector(".comments-container");
  const commentHeader = `
    <div class <div class="comment-header">
        <h3 class="comment-no">Comments(${!comments ? 0 : comments.length})</h3>
    </div>`;
  commentContainer.insertAdjacentHTML("afterbegin", commentHeader);

  comments.map((comment) => {
    const commentHtml = `
              <div class="comment" comment-id=${comment.id}>
                  <div class="comment-img-container">
                  <img src=${comment.avatar} alt="image" class="comment-img">
                  </div>
                  <div class="comment-content">
                    <div class="comment-heading">
                            <p class="comment-title">${comment.name}</p>
                            <div class="comment-format">
                                    <a class="button-stlyed primary edit" href="../pages/editComment.html?newsId=${comment.newsId}&id=${comment.id}">Edit</a>
                                    <a class="button-stlyed primary delete">Delete</a>
                            </div>
                    </div>
                      <p class="comment-body">${comment.comment}</p>
                  </div>
              </div>
          `;
    commentContainer.insertAdjacentHTML("beforeend", commentHtml);
  });
};

const showCommentsForm = async () => {
  const urlParams = new URLSearchParams(window.location.search).get("id");
  const commentsForm = document.querySelector("#comments-form");
  const comments = await getUserComments(urlParams);

  commentsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(commentsForm);
    const payload = {
      newsId: Number(comments.length + 1),
      name: formData.get("name"),
      avatar: formData.get("avatar"),
      comment: formData.get("comment"),
    };
    await postComment(urlParams, payload);
    window.location.reload();
  });
};

const handleEditComment = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("newsId");
  const id = urlParams.get("id");
  const comments = await getUserComments(newsId);
  const comment = comments.find((comment) => Number(comment.id) === Number(id));
  console.log(comment, "oo");
  const commentForm = document.querySelector("#edit-comment-form");
  document.querySelector("input[name=name]").defaultValue = comment.name;
  document.querySelector("input[name=avatar]").defaultValue = comment.avatar;
  document.querySelector("textarea[name=comment]").defaultValue =
    comment.comment;

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(commentForm);
    const payload = {
      name: formData.get("name"),
      avatar: formData.get("avatar"),
      comment: formData.get("comment"),
    };
    const data = await updateComment(newsId, id, payload);
    if (data) {
      window.location.assign(`../pages/details.html?id=${newsId}`);
    }
  });
};

const handleDeleteComment = async (newsId) => {
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const commentId =
        e.target.parentNode.parentNode.parentNode.parentNode.getAttribute(
          "comment-id"
        );
      await deleteComment(newsId, commentId);
      window.location.reload();
    });
  });
};

if (window.location.href.includes("home.html")) {
  document.addEventListener("load", handleHome());
}

if (window.location.href.includes("details.html")) {
  document.addEventListener("load", handleNewsDetails());
}

if (window.location.href.includes("edit.html")) {
  document.addEventListener("load", editNewsForm());
}

if (window.location.href.includes("editComment.html")) {
  document.addEventListener("load", handleEditComment());
}




