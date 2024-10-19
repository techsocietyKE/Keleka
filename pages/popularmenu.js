import MenuItem from '@/components/MenuItem'
import React, { useEffect, useState } from 'react'

export default function PopularMenu() {
  const [popular, setPopular] = useState([])

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setPopular(menuItems.slice(-6))
      })
    })
  }, [])

  return (
    <div>
      <section className="md:m-5">
        <h2 className="md:text-3xl tracking-wider text-xl font-bold mb-4 text-center text-primary my-8">Popular Menu</h2>
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
