import PostCard from "src/routes/Feed/PostList/PostCard"
import React, { useMemo } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled"
import { filterPosts } from "./filterPosts"
import { DEFAULT_CATEGORY } from "src/constants"

type Props = {
  q: string
}

const PinnedPosts: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  //console.log("Fetched data:", data) // 데이터 로깅

  const filteredPosts = useMemo(() => {
    const baseFiltered = filterPosts({
      posts: data,
      q,
      category: DEFAULT_CATEGORY,
      order: "desc",
    })
    //console.log("Filtered posts (base):", baseFiltered) // 필터링된 데이터 로깅

    const pinnedPosts = baseFiltered.filter((post) => post.tags?.includes("Pinned"))
    //console.log("Pinned posts:", pinnedPosts) // 고정된 포스트 로깅

    return pinnedPosts
  }, [data, q])

  if (filteredPosts.length === 0) return <div>고정된 포스트가 없습니다</div> // 없을 때 메시지

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="header">📌 Pinned Posts</div>
      </div>
      <div className="my-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} data={post} />
        ))}
      </div>
    </StyledWrapper>
  )
}

export default PinnedPosts

const StyledWrapper = styled.div`
  position: relative;
  .wrapper {
    display: flex;
    margin-bottom: 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }
  .header {
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
    align-items: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    cursor: pointer;
  }
`
