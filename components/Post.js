import Image from "next/image"
import Link from 'next/link'

export default function Post({ post }) {
  return (
    <div className='card'>
      <div style={{ position: "relative", width: "100%", height: "200px" }}>
        <Image layout="fill" objectFit="cover" objectPosition="50% 50%" src={post.frontmatter.cover_image} alt=''></Image>
      </div>

      <div className='post-date'>Posted on {post.frontmatter.date}</div>

      <h3>{post.frontmatter.title}</h3>

      <p>{post.frontmatter.excerpt}</p>

      <Link href={`/blog/${post.slug}`}>
        <a className='btn'>阅读</a>
      </Link>
    </div>
  )
}
