import MenuItem from '@/components/MenuItem'
import React, { useEffect, useState } from 'react'

export default function PopularMenu() {
  const [popular, setPopular] = useState([])

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setPopular(menuItems.slice(3))
      })
    })
  }, [])

  return (
    <div>
      <section className="md:m-5">
        {popular?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
