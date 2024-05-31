let allJobsData = [];
let selectedFilters = [];

async function importData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generateJobListing(job) {
    const jobListing = document.createElement('section');
    jobListing.classList.add('job-listing');

    const image = document.createElement('div');
    image.classList.add('image');
    image.innerHTML = `<img src="${job.logo}" alt="${job.company}" srcset="">`;

    const info = document.createElement('div');
    info.classList.add('info');

    const infoLeft = document.createElement('div');
    infoLeft.classList.add('infoLeft');

    const infoLeftTop = document.createElement('div');
    infoLeftTop.classList.add('infoLeftTop');
    infoLeftTop.innerHTML = `
        <h3>${job.company}</h3>
        ${job.new ? '<h3>New</h3>' : ''}
        ${job.featured ? '<h3>Featured</h3>' : ''}
    `;

    const infoLeftMiddle = document.createElement('div');
    infoLeftMiddle.classList.add('infoLeftMiddle');
    infoLeftMiddle.innerHTML = `<h4>${job.position}</h4>`;

    const infoLeftBottom = document.createElement('div');
    infoLeftBottom.classList.add('infoLeftBottom');
    infoLeftBottom.innerHTML = `
        <p>${job.postedAt}</p>
        <p>${job.contract}</p>
        <p>${job.location}</p>
    `;

    const infoRightInner = document.createElement('div');
    infoRightInner.classList.add('infoRightInner');

    const rolesAndSkills = [job.role, job.level, ...job.languages, ...job.tools];
    rolesAndSkills.forEach(item => {
        const button = document.createElement('button');
        button.classList.add('button');
        button.innerHTML = item;
        button.addEventListener('click', () => addFilter(item));
        infoRightInner.appendChild(button);
    });

    infoLeft.appendChild(infoLeftTop);
    infoLeft.appendChild(infoLeftMiddle);
    infoLeft.appendChild(infoLeftBottom);
    info.appendChild(infoLeft);
    jobListing.appendChild(image);
    jobListing.appendChild(info);
    jobListing.appendChild(infoRightInner);

    return jobListing;
}

function addFilter(category) {
    if (!selectedFilters.includes(category)) {
        selectedFilters.push(category);
        updateSearchInput();
        filterJobs();
    }
}

function updateSearchInput() {
    const search = document.querySelector('.search');
    search.innerHTML = ''; // Clear previous filters
    selectedFilters.forEach(filter => {
        const filterElement = document.createElement('p');
        filterElement.innerText = filter;
        search.appendChild(filterElement);
    });
}

function filterJobs() {
    const filteredJobs = allJobsData.filter(job => {
        const rolesAndSkills = [job.role, job.level, ...job.languages, ...job.tools];
        return selectedFilters.every(filter => rolesAndSkills.includes(filter));
    });

    const jobListingElement = document.getElementById('jobListing');
    jobListingElement.innerHTML = '';

    filteredJobs.forEach(job => {
        const jobListing = generateJobListing(job);
        jobListingElement.appendChild(jobListing);
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    allJobsData = await importData();
    if (allJobsData && allJobsData.length) {
        allJobsData.forEach((job) => {
            const jobListing = generateJobListing(job);
            document.querySelector('#jobListing').appendChild(jobListing);
        });
    }
});


