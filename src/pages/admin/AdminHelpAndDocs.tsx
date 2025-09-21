import React from 'react';
import { BookOpen, Lightbulb, CheckCircle, Settings, Calendar, Users, Handshake, Bot, Award, Newspaper, Image, Images, Info, Home, DollarSign } from 'lucide-react';

const AdminHelpAndDocs: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
      <div className="flex items-center mb-8">
        <BookOpen className="h-8 w-8 text-[#0d2f60] mr-3" />
        <h2 className="text-3xl font-bold text-[#0d2f60]">Website Update Guide</h2>
      </div>
      <p className="text-lg text-gray-700 mb-8">
        Welcome, future team members! This guide helps you keep our website fresh and up-to-date each year. Most content can be managed through this Admin Panel, making updates straightforward.
      </p>

      <div className="space-y-10">
        {/* General Principles */}
        <section>
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-[#d92507] mr-2" />
            <h3 className="text-2xl font-bold text-[#d92507]">How Website Updates Work</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Our website uses a system where most of the information you see on the public pages is stored in a database called Supabase. The <strong>Admin Panel</strong> is your friendly interface to this database. Think of it as a control center where you can add, change, or remove content without needing to write any code.
          </p>
          <p className="text-gray-700">
            When you make a change in the Admin Panel, it updates the information in Supabase, and then our website automatically shows those changes.
          </p>
        </section>

        {/* Your Main Tool: The Admin Panel */}
        <section>
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-[#0d2f60] mr-2" />
            <h3 className="text-2xl font-bold text-[#0d2f60]">Your Main Tool: The Admin Panel</h3>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
            <li>
              <strong>Log in to the Admin Panel</strong>: You'll typically find a "Login" link in the website's footer. Use your team's designated administrator credentials to access the panel.
            </li>
            <li>
              <strong>Navigate Through Tabs</strong>: Once logged in, you'll see a series of main tabs (like "Home," "About," "Events," etc.) and sometimes sub-tabs within them. These tabs correspond to different sections of the website you can manage.
            </li>
            <li>
              <strong>Use the Forms</strong>: Each section in the Admin Panel will have forms where you can input text, upload images, or select options. Fill these out carefully.
            </li>
            <li>
              <strong>Save Your Changes</strong>: Always look for a "Save Changes" or "Add" button after you've made your updates in a form.
            </li>
            <li>
              <strong>Check the Live Website</strong>: After saving, always visit the public-facing page on our website to make sure your changes look correct.
            </li>
          </ol>
        </section>

        {/* Step-by-Step Annual Update Guide */}
        <section>
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-2xl font-bold text-green-600">Step-by-Step Annual Update Guide</h3>
          </div>

          {/* Events and Achievements */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-[#d92507] mr-2" />
              <h4 className="text-xl font-semibold text-[#d92507]">1. Events and Team Achievements</h4>
            </div>
            <p className="text-gray-700 mb-2">This section covers our competition history and awards.</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: New competition events, their results, and any awards the team receives.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">Events</span> &gt; Sub-Tab: <span className="font-semibold">Events List</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Sync with The Blue Alliance (TBA)</strong>: Find the "Sync All Event Data from TBA" button on the Dashboard or Events List. Click it! This automatically pulls in our team's event details, rankings, and awards from The Blue Alliance. **Important**: This replaces existing TBA-sourced event data.</li>
                  <li><strong>Add Manual Events (if needed)</strong>: For events not on TBA, use the "Add Event" button and fill in details.</li>
                  <li><strong>Manage Manual Achievements</strong>: Go to <span className="font-semibold">About</span> &gt; <span className="font-semibold">Achievements</span>. Use "Add Manual Achievement" for non-event awards. TBA-synced awards cannot be changed here.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Visit the "Events" page and the "About" page on the public website.</li>
            </ul>
          </div>

          {/* Our Robots */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Bot className="h-5 w-5 text-[#0d2f60] mr-2" />
              <h4 className="text-xl font-semibold text-[#0d2f60]">2. Our Robots</h4>
            </div>
            <p className="text-gray-700 mb-2">Showcase our latest robot and past creations!</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add details and an image for the new season's robot.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">Robots</span> &gt; Sub-Tab: <span className="font-semibold">Robots List</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Add New Robot</strong>: Click "Add Robot."</li>
                  <li><strong>Fill out the form</strong>: Enter the robot's name, year, upload an image, and add specifications or awards as text.</li>
                  <li><strong>Edit/Delete Existing Robots</strong>: Use the "Edit" or "Delete" buttons.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Check the "Robots" page on the public website.</li>
            </ul>
          </div>

          {/* Team Members */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-[#d92507] mr-2" />
              <h4 className="text-xl font-semibold text-[#d92507]">3. Team Members</h4>
            </div>
            <p className="text-gray-700 mb-2">Keep our team roster current!</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add new team members, update roles, or remove members who have graduated or moved on.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">About</span> &gt; Sub-Tab: <span className="font-semibold">Team Members</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Add New Team Member</strong>: Click "Add Team Member."</li>
                  <li><strong>Fill out the form</strong>: Enter name, role, and upload a profile image.</li>
                  <li><strong>Edit/Delete Existing Members</strong>: Use the "Edit" or "Delete" buttons.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Visit the "About" page on the public website.</li>
            </ul>
          </div>

          {/* Sponsors and Sponsorship Tiers */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Handshake className="h-5 w-5 text-[#0d2f60] mr-2" />
              <h4 className="text-xl font-semibold text-[#0d2f60]">4. Sponsors and Sponsorship Tiers</h4>
            </div>
            <p className="text-gray-700 mb-2">Our sponsors are vital! This section helps us recognize their support.</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add new sponsors, update existing sponsor details, or adjust the different levels of sponsorship we offer.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">Sponsors</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Manage Sponsorship Tiers</strong>: Go to the <span className="font-semibold">Sponsorship Tiers</span> sub-tab. Adjust names, prices, benefits, or display colors.</li>
                  <li><strong>Manage Sponsors List</strong>: Go to the <span className="font-semibold">Sponsors List</span> sub-tab. Click "Add Sponsor," fill in details, upload logo, and choose "Image Fit" (e.g., "Fit" for whole logo, "Fill" to cover area).</li>
                  <li><strong>Edit/Delete Existing Sponsors</strong>: Use the "Edit" or "Delete" buttons.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Check the "Sponsors" page and the "Donate" page on the public website.</li>
            </ul>
          </div>

          {/* Website Settings (Home Page Previews & Footer) */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Home className="h-5 w-5 text-[#d92507] mr-2" />
              <h4 className="text-xl font-semibold text-[#d92507]">5. Website Settings (Home Page Previews & Footer)</h4>
            </div>
            <p className="text-gray-700 mb-2">These settings control the main content on our home page and the information at the very bottom of every page (the footer).</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: The main title and subtitle on the home page, the preview sections for "About," "Events," and "Sponsors" on the home page, and the contact/social media links in the footer.</li>
              <li><strong>Where to go in the Admin Panel</strong>:
                <ul>
                  <li>Main Tab: <span className="font-semibold">Home</span> (for hero and preview sections)</li>
                  <li>Main Tab: <span className="font-semibold">Settings</span> (for footer settings)</li>
                </ul>
              </li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Home Page Sections</strong>: Go to the <span className="font-semibold">Home</span> tab, then select sub-tabs like "Hero Section," "About Preview," "Events Preview," and "Sponsors Preview." Update titles, descriptions, and images.</li>
                  <li><strong>Footer Settings</strong>: Go to the <span className="font-semibold">Settings</span> tab, then the <span className="font-semibold">Footer Settings</span> sub-tab. Update address, email, and manage social media links.</li>
                  <li><strong>Save Changes</strong>: Always click "Save Changes" after updating a form.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Review the home page and the footer on any page of the public website.</li>
            </ul>
          </div>

          {/* News Articles */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Newspaper className="h-5 w-5 text-[#0d2f60] mr-2" />
              <h4 className="text-xl font-semibold text-[#0d2f60]">6. News Articles</h4>
            </div>
            <p className="text-gray-700 mb-2">Share our latest stories and updates!</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add new articles, edit existing ones, or remove old news.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">News</span> &gt; Sub-Tab: <span className="font-semibold">News Articles</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Add New News Article</strong>: Click "Add News Article."</li>
                  <li><strong>Fill out the form</strong>: Enter title, publish date, and content (Markdown is supported). Upload multiple images.</li>
                  <li><strong>Edit/Delete Existing Articles</strong>: Use the "Edit" or "Delete" buttons.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Visit the "News" page on the public website.</li>
            </ul>
          </div>

          {/* Award Banners */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Award className="h-5 w-5 text-[#d92507] mr-2" />
              <h4 className="text-xl font-semibold text-[#d92507]">7. Award Banners</h4>
            </div>
            <p className="text-gray-700 mb-2">These are the scrolling banners at the top of our home page.</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add new award banners for recent achievements.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">Home</span> &gt; Sub-Tab: <span className="font-semibold">Award Banners</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Add New Banner</strong>: Click "Add Banner."</li>
                  <li><strong>Fill out the form</strong>: Enter the year and the text for the banner (e.g., "Regional Winner").</li>
                  <li><strong>Edit/Delete Existing Banners</strong>: Use the "Edit" or "Delete" buttons.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Check the home page of the public website.</li>
            </ul>
          </div>

          {/* Slideshow Images (About Page Hero) */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Images className="h-5 w-5 text-[#0d2f60] mr-2" />
              <h4 className="text-xl font-semibold text-[#0d2f60]">8. Slideshow Images (About Page Hero)</h4>
            </div>
            <p className="text-gray-700 mb-2">The "About" page has a rotating slideshow of images at the top.</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add new images to the slideshow, change their order, or remove old ones.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">Home</span> &gt; Sub-Tab: <span className="font-semibold">Slideshow Images</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Add New Image</strong>: Click "Add Image."</li>
                  <li><strong>Fill out the form</strong>: Upload the image and set a "Sort Order" (lower numbers appear first).</li>
                  <li><strong>Edit/Delete Existing Images</strong>: Use the "Edit" or "Delete" buttons. Deleting an image here also removes it from our website's storage.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Visit the "About" page on the public website.</li>
            </ul>
          </div>

          {/* Unitybot Resources and Initiatives */}
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <div className="flex items-center mb-3">
              <Bot className="h-5 w-5 text-[#d92507] mr-2" />
              <h4 className="text-xl font-semibold text-[#d92507]">9. Unitybot Resources and Initiatives</h4>
            </div>
            <p className="text-gray-700 mb-2">These sections on the "Unitybots" page highlight our outreach and educational efforts.</p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
              <li><strong>What to update</strong>: Add new resources or initiatives, update descriptions, images, or links.</li>
              <li><strong>Where to go in the Admin Panel</strong>: Main Tab: <span className="font-semibold">Unitybots</span></li>
              <li><strong>How to update</strong>:
                <ol className="list-decimal list-inside pl-6 space-y-1">
                  <li><strong>Manage Resources</strong>: Go to the <span className="font-semibold">Unitybot Resources</span> sub-tab. Use "Add Resource" to create new entries, providing a title, description, image, and links.</li>
                  <li><strong>Manage Initiatives</strong>: Go to the <span className="font-semibold">Unitybot Initiatives</span> sub-tab. Use "Add Initiative" to create new entries, providing a title, description, image, and links.</li>
                  <li><strong>Edit/Delete Existing Items</strong>: Use the "Edit" or "Delete" buttons.</li>
                </ol>
              </li>
              <li><strong>After updating</strong>: Visit the "Unitybots" page on the public website.</li>
            </ul>
          </div>
        </section>

        {/* Important Reminders */}
        <section>
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-[#0d2f60] mr-2" />
            <h3 className="text-2xl font-bold text-[#0d2f60]">Important Reminders for All Updates</h3>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700 pl-4">
            <li>
              <strong>Be Specific</strong>: When writing descriptions or titles, be clear and concise.
            </li>
            <li>
              <strong>Image Quality</strong>: Try to use good quality images that are relevant to the content. The system handles storing them, but a clear original image makes a big difference.
            </li>
            <li>
              <strong>Double-Check Everything</strong>: After making any changes in the Admin Panel, always open the public website in your browser and navigate to the page you updated. This helps ensure everything looks and works as expected.
            </li>
            <li>
              <strong>Ask for Help</strong>: If you're unsure about anything, don't hesitate to ask a more experienced team member or mentor for guidance!
            </li>
          </ul>
          <p className="text-gray-700 mt-6">
            By following this guide, you'll be able to keep the Tomball Robotics website a vibrant and accurate reflection of our team's hard work and achievements for years to come!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AdminHelpAndDocs;