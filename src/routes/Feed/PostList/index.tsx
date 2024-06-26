import PostCard from "src/routes/Feed/PostList/PostCard";
import React, { useEffect, useState, useMemo } from "react";
import usePostsQuery from "src/hooks/usePostsQuery";
import { useRouter } from "next/router";
import { filterPosts } from "./filterPosts";
import { DEFAULT_CATEGORY } from "src/constants";

type Props = {
  q: string;
};

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter();
  const data = usePostsQuery();

  const [filteredPosts, setFilteredPosts] = useState(data);

  const currentTag = `${router.query.tag || ``}` || undefined;
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY;
  const currentOrder = `${router.query.order || ``}` || "desc";
  const currentAuthor = `${router.query.author || ``}` || undefined;

  useEffect(() => {
    setFilteredPosts(() => {
      let newFilteredPosts = data;
      // keyword
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : "";
        const searchContent = post.title + post.summary + tagContent;
        return searchContent.toLowerCase().includes(q.toLowerCase());
      });

      // tag
      if (currentTag) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post && post.tags && post.tags.includes(currentTag)
        );
      }

      // category
      if (currentCategory !== DEFAULT_CATEGORY) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) =>
            post && post.category && post.category.includes(currentCategory)
        );
      }

      // author
      if (currentAuthor) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) =>
            post.author &&
            post.author.some((author) => author.name === currentAuthor)
        );
      }

      // order
      if (currentOrder !== "desc") {
        newFilteredPosts = newFilteredPosts.reverse();
      }

      return newFilteredPosts;
    });
  }, [q, currentTag, currentCategory, currentOrder, currentAuthor, setFilteredPosts, data]);

  return (
    <>
      <div className="my-2">
        {!filteredPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">Nothing! 😺</p>
        )}
        {filteredPosts.map((post) => (
          <PostCard key={post.id} data={post} showMedia={true} />
        ))}
      </div>
    </>
  );
};

export default PostList;
