window.sectionObserver = {

    observeSections: () => {

        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting)
                    return;

                const id = entry.target.id;

                history.replaceState(
                    null,
                    "",
                    `${window.location.pathname}#${id}`
                );

            });

        }, {
            threshold: 0.5
        });

        sections.forEach(section => observer.observe(section));
    }
};