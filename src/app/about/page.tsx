'use client';
import {FC} from 'react';
const Page:FC = () => {
  return (
    <div>
      
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading Section */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              About <span className="text-blue-600">Present Pal</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Simplifying gift giving with a personalized and thoughtful experience.
            </p>
          </div>

          {/* Introduction Section */}
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Present Pal is designed to make gift-giving easy and meaningful. Whether it's
                  for a birthday, anniversary, or any special event, our platform allows you
                  to create and manage personalized gift registries, ensuring your loved ones
                  receive the perfect gift every time.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  What We Do
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  We provide an easy-to-use platform where users can create custom gift
                  registries, manage events, and share their wishes with friends and family.
                  Our platform ensures that the gift-giving process is thoughtful, organized,
                  and enjoyable.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-center text-lg text-gray-600 mt-4">
              We're passionate about making gift-giving special and memorable.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/team/abhishek.jpg" // Replace with actual image path
                  alt="Abhishek Pandey"
                  className="w-24 h-24 mx-auto rounded-full"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Abhishek Pandey
                </h3>
                <p className="mt-2 text-gray-600">Founder & Backend Developer</p>
                <p className="mt-2 text-sm text-gray-500">
                  Expert in JavaScript and backend systems, Abhishek leads the development
                  of Present Pal's core functionalities.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/team/member2.jpg" // Replace with actual image path
                  alt="Team Member 2"
                  className="w-24 h-24 mx-auto rounded-full"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Team Member 2
                </h3>
                <p className="mt-2 text-gray-600">Frontend Developer</p>
                <p className="mt-2 text-sm text-gray-500">
                  Specializing in user interface design and experience, responsible for creating
                  beautiful and intuitive UIs.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/team/member3.jpg" // Replace with actual image path
                  alt="Team Member 3"
                  className="w-24 h-24 mx-auto rounded-full"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Team Member 3
                </h3>
                <p className="mt-2 text-gray-600">Product Manager</p>
                <p className="mt-2 text-sm text-gray-500">
                  Leading the product vision and strategy to ensure we deliver an outstanding
                  experience to our users.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join Present Pal and start creating meaningful gift registries today.
            </p>
            <button className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
