import { useEffect, useState } from 'react'
import { api } from './api'
import { articles } from './data'
import { Icon } from './Icon'
import { SimpleHero } from './Shared'

export function BlogsPage() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [visibleArticles, setVisibleArticles] = useState(articles)
  const [message, setMessage] = useState('')
  const categories = [
    ['grid', 'All', '24'],
    ['heart', 'Nutrition', '8'],
    ['headset', 'Fitness', '6'],
    ['chart', 'Mental Health', '5'],
    ['sos', 'Diseases', '7'],
    ['user', 'Women Health', '5'],
    ['heart', 'Kids Health', '4'],
  ]

  useEffect(() => {
    let active = true
    api.articles({ q: query, category })
      .then((items) => {
        if (active) setVisibleArticles(items)
      })
      .catch(() => {
        if (active) setVisibleArticles(articles)
      })
    return () => {
      active = false
    }
  }, [category, query])

  return (
    <>
      <SimpleHero
        title="Health Blogs & Tips"
        text="Explore our latest health tips, news and expert advice to lead a healthier and happier life."
        art="blog"
      >
        <button className="primary-button" type="button">Explore Articles <span>{'->'}</span></button>
      </SimpleHero>

      <section className="category-section">
        <h2>Categories</h2>
        <div className="category-grid">
          {categories.map(([icon, label, count]) => (
            <button className={category === label ? 'active' : ''} type="button" key={label} onClick={() => setCategory(label)}>
              <Icon name={icon} />
              <span>{label}<small>{count}</small></span>
            </button>
          ))}
        </div>
      </section>

      <section className="blog-layout">
        <div>
          <div className="section-head">
            <h2>Latest Articles</h2>
            <select aria-label="Sort articles"><option>Newest First</option></select>
          </div>
          <div className="article-grid">
            {visibleArticles.map((article) => <ArticleCard article={article} key={article.id || article[1]} />)}
          </div>
          <button className="outline-button load-more" type="button">Load More Articles</button>
        </div>

        <aside className="blog-sidebar">
          <label className="search-box"><Icon name="search" /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search articles..." value={query} /></label>
          <div className="side-card">
            <h3>Popular Articles</h3>
            {articles.slice(0, 4).map(([category, title, , date]) => (
              <div className="popular-item" key={title}>
                <ArticleVisual tag={category} />
                <div><strong>{title}</strong><span>{date}</span></div>
              </div>
            ))}
          </div>
          <div className="side-card subscribe-card">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get the latest health tips and articles straight to your inbox.</p>
            <input placeholder="Enter your email" />
            <button className="primary-button" type="button" onClick={() => setMessage('Newsletter signup is ready for backend email integration.')}>Subscribe</button>
            {message && <p className="form-message success">{message}</p>}
          </div>
        </aside>
      </section>
    </>
  )
}

function ArticleCard({ article }) {
  const category = article.category || article[0]
  const title = article.title || article[1]
  const text = article.summary || article[2]
  const date = article.date || article[3]
  const readTime = article.readTime || article[4]

  return (
    <article className="article-card">
      <ArticleVisual tag={category} />
      <div className="article-body">
        <h3>{title}</h3>
        <p>{text}</p>
        <div><span><Icon name="calendar" /> {date}</span><span><Icon name="records" /> {readTime}</span></div>
      </div>
    </article>
  )
}

function ArticleVisual({ tag }) {
  return (
    <div className={`article-visual ${tag.toLowerCase().replaceAll(' ', '-')}`}>
      <span>{tag}</span>
    </div>
  )
}
