<!-- src/routes/index.svelte -->

  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-md z-10">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Laravel Conference</h1>
        <nav>
          <ul class="flex space-x-4">
            <li>
              <a href="#" class="text-gray-500 hover:text-gray-700">Home</a>
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-gray-700">Schedule</a>
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-gray-700">Speakers</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

<!-- Hero section -->
<section class="relative bg-gradient-to-br from-pink-400 to-purple-400 py-20">
  <svg class="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F48FB1" />
        <stop offset="50%" stop-color="#BA68C8" />
        <stop offset="100%" stop-color="#9575CD" />
      </linearGradient>
    </defs>
    <path fill="url(#gradient)" d="M141.6,96.6c0,1-0.8,1.7-1.7,1.7H69.6c-0.9,0-1.7-0.8-1.7-1.7v-7.2c0-0.9,0.8-1.7,1.7-1.7h70.3c0.9,0,1.7,0.8,1.7,1.7V96.6z M97.6,79.2c-5.8,0-10.5-4.7-10.5-10.5s4.7-10.5,10.5-10.5s10.5,4.7,10.5,10.5S103.4,79.2,97.6,79.2z M119.6,79.2c-5.8,0-10.5-4.7-10.5-10.5s4.7-10.5,10.5-10.5s10.5,4.7,10.5,10.5S125.4,79.2,119.6,79.2z M141.6,79.2c-5.8,0-10.5-4.7-10.5-10.5s4.7-10.5,10.5-10.5s10.5,4.7,10.5,10.5S147.4,79.2,141.6,79.2z M163.6,79.2c-5.8,0-10.5-4.7-10.5-10.5s4.7-10.5,10.5-10.5s10.5,4.7,10.5,10.5S169.4,79.2,163.6,79.2z M146.8,55.2c0,1-0.8,1.7-1.7,1.7h-7.2c-0.9,0-1.7-0.8-1.7-1.7v-4.6c0-0.9,0.8-1.7,1.7-1.7h7.2c1,0,1.7,0.8,1.7,1.7V55.2z M141.6,43.2c-13.1,0-23.8,10.7-23.8,23.8s10.7,23.8,23.8,23.8s23.8-10.7,23.8-23.8S154.8,43.2,141.6,43.2z M119.6,107.2c-1,0-1.7-0.8-1.7-1.7v-7.2c0-0.9,0.8-1.7,1.7-1.7h70.3c0.9,0,1.7,0.8,1.7,1.7v7.2c0,0.9-0.8,1.7-1.7H119.6z"/>

  </svg>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
    <h2 class="text-4xl font-extrabold text-white mb-8 text-center">Satisfy Your Sweet Tooth with Our Freshly Baked Treats</h2>
    <p class="text-lg text-white mb-12 text-center">From cakes to cookies, we have everything you need to satisfy your cravings.</p>
    <a href="#" class="bg-white text-pink-400 font-medium py-2 px-6 rounded-full hover:bg-pink-400 hover:text-white transition-colors">Order Now</a>
  </div>
</section>




    <!-- Speakers section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-8">Speakers</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <li>
            <div class="bg-white rounded-lg shadow-md">
              <div class="h-48 w-full bg-cover bg-center rounded-t-lg" style="background-image: url(https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8)"></div>
              <div class="p-6">
                <h3 class="text-xl font-medium text-gray-900 mb-2">Kai Sassnowski</h3>
                <p class="text-gray-500 mb-2">Type Aficionado</p>
                <a href="#" class="text-blue-500 hover:text-blue-700 font-medium transition-colors">Learn more</a>
              </div>
            </div>
          </li>
          <li>
            <div class="bg-white rounded-lg shadow-md">
              <div class="h-48 w-full bg-cover bg-center rounded-t-lg" style="background-image: url(https://images.unsplash.com/photo-1587502533178-23890aabd259?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=500&amp;q=60)"></div>
              <div class="p-6">
                <h3 class="text-xl font-medium text-gray-900 mb-2">Sara Vieira</h3>
                <p class="text-gray-500 mb-2">React Developer, CodeSandbox</p>
                <a href="#" class="text-blue-500 hover:text-blue-700 font-medium transition-colors">Learn more</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Schedule section -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-8">Schedule</h2>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">9:00 AM</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Registration</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lobby</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">10:00 AM</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Opening Keynote</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Auditorium</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">11:00 AM</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Breakout Sessions</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Various Rooms</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">12:00 PM</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lunch</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cafeteria</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1:00 PM</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Breakout Sessions</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Various Rooms</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2:00 PM</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Closing Keynote</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                11:00 AM - 12:00 PM
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Backend Unit Testing with PHPUnit
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Sponsors section -->
    <section class="bg-gray-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-8">Sponsors</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <li>
            <div class="bg-white rounded-lg shadow-md p-6">
              <img src="https://via.placeholder.com/300x200" alt="Placeholder image" class="w-full h-48 object-cover mb-6 rounded-lg">
              <h3 class="text-xl font-medium text-gray-900 mb-2">Acme Inc.</h3>
              <p class="text-gray-500 mb-2">Platinum Sponsor</p>
              <a href="#" class="text-blue-500 hover:text-blue-700 font-medium transition-colors">Visit website</a>
            </div>
          </li>
          <li>
            <div class="bg-white rounded-lg shadow-md p-6">
              <img src="https://via.placeholder.com/300x200" alt="Placeholder image" class="w-full h-48 object-cover mb-6 rounded-lg">
              <h3 class="text-xl font-medium text-gray-900 mb-2">Techo Corp.</h3>
              <p class="text-gray-500 mb-2">Gold Sponsor</p>
              <a href="#" class="text-blue-500 hover:text-blue-700 font-medium transition-colors">Visit website</a>
            </div>
          </li>
          <li>
            <div class="bg-white rounded-lg shadow-md p-6">
              <img src="https://via.placeholder.com/300x200" alt="Placeholder image" class="w-full h-48 object-cover mb-6 rounded-lg">
              <h3 class="text-xl font-medium text-gray-900 mb-2">Quiver Inc.</h3>
              <p class="text-gray-500 mb-2">Silver Sponsor</p>
              <a href="#" class="text-blue-500 hover:text-blue-700 font-medium transition-colors">Visit website</a>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Footer -->

      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-100">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div class="mb-4 sm:mb-0">
            <h3 class="text-lg font-medium">Laravel Conference</h3>
            <p class="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis semper justo. Morbi quis augue at arcu pharetra suscipit. In hac habitasse platea dictumst. Sed tempus fringilla nisl non efficitur. </p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-300 hover:text-gray-400">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.446 19.446V12h2.66l.397-3.104h-3.057v-1.988c0-.902.25-1.515 1.54-1.515h1.642V1.27A23.036 23.036 0 0 0 15.1 1.209c-2.496 0-4.202 1.523-4.202 4.326v2.41H7v3.104h3.898v7.446h3.548z"
                ></path>
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-gray-400">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.993 5.655a.984.984 0 0 1-.028.218c-1.008 4.48-5.06 7.604-9.604 7.604-1.898 0-3.67-.56-5.174-1.516a3.397 3.397 0 0 0-2.054-.7A3.483 3.483 0 0 0 1.997 15.3c0 .262.028.516.084.756A9.771 9.771 0 0 1 2.31 13.29a4.32 4.32 0 0 0-.56-1.984 4.048 4.048 0 0 0-2.988-1.484 3.377 3.377 0 0 0-.308.015 4.478 4.478 0 0 1 .472-2.308A9.85 9.85 0 0 1 7.01 5.415a3.386 3.386 0 0 1 4.572 3.164v.422c0 2.452 1.68 4.496 3.956"
                  />
              </svg>
            </a>
          </div>
        </div>
      </footer>

  </div>