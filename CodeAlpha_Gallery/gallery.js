 document.addEventListener('DOMContentLoaded', () => {
      const items = Array.from(document.querySelectorAll('.gallery-item'));
      const filterBtns = document.querySelectorAll('.filter-btn');
      
      const lightbox = document.getElementById('lightbox');
      const lbImg = document.getElementById('lbImg');
      const lbCaption = document.getElementById('lbCaption');
      const lbClose = document.getElementById('lbClose');
      const lbPrev = document.getElementById('lbPrev');
      const lbNext = document.getElementById('lbNext');

      let visibleItems = [...items];
      let currentIndex = 0;

      /* ----------------------------------------------------------------------
         1. Interactive Pointer-Aware Radial Lighting Effect on Cards
         ---------------------------------------------------------------------- */
      items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          item.style.setProperty('--mouse-x', `${x}px`);
          item.style.setProperty('--mouse-y', `${y}px`);
        });
      });

      /* ----------------------------------------------------------------------
         2. Category Filter Logic
         ---------------------------------------------------------------------- */
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter');

          items.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (category === 'all' || itemCat === category) {
              item.classList.remove('hide');
            } else {
              item.classList.add('hide');
            }
          });

          // Update active list for Lightbox navigation
          visibleItems = items.filter(item => !item.classList.contains('hide'));
        });
      });

      /* ----------------------------------------------------------------------
         3. Lightbox Logic
         ---------------------------------------------------------------------- */
      function openLightbox(index) {
        currentIndex = index;
        const targetItem = visibleItems[currentIndex];
        const img = targetItem.querySelector('img');
        const title = targetItem.querySelector('h3').innerText;

        lbImg.src = img.src;
        lbCaption.innerText = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      }

      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }

      function showNext() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
      }

      function showPrev() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
      }

      // Event Listeners for Opening Lightbox
      items.forEach(item => {
        item.addEventListener('click', () => {
          const indexInVisible = visibleItems.indexOf(item);
          if (indexInVisible !== -1) {
            openLightbox(indexInVisible);
          }
        });
      });

      // Controls Event Listeners
      lbClose.addEventListener('click', closeLightbox);
      lbNext.addEventListener('click', showNext);
      lbPrev.addEventListener('click', showPrev);

      // Close when clicking background outside content
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      // Keyboard Controls (Esc, Left/Right Arrows)
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      });
    });