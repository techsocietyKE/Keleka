import { motion } from 'framer-motion';
import MenuItem from '@/components/MenuItem';
import React, { useEffect, useState } from 'react';

export default function PopularMenu() {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    fetch('/api/menu-items').then((res) => {
      res.json().then((menuItems) => {
        setPopular(menuItems.slice(-6));
      });
    });
  }, []);

  return (
    <div>
      <section className="md:m-5">
        <h2 className="md:text-3xl tracking-wider text-xl font-bold mb-4 text-center text-primary my-8">
          Popular Menu
        </h2>
        {popular?.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
          >
            {popular.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
