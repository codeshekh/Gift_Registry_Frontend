// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const CreateGroupPage = () => {
//   const [groupName, setGroupName] = useState('');
//   const [description, setDescription] = useState('');
//   const [userId, setUserId] = useState(1); // Assuming the main userId is always 1 (modify if dynamic)
//   const [additionalUserIds, setAdditionalUserIds] = useState('');
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Parse the additional userIds from the input
//     const userIdArray = additionalUserIds.split(',').map(Number); 

//     const payload = {
//       createGroupDto: {
//         userId, // The main userId
//         groupName,
//         description,
//       },
//       userId: [userId, ...userIdArray], // Merge the main userId with additional ones
//     };

//     try {
//       const response = await axios.post('http://localhost:4000/groups', payload);

//       if (response.data.data) {
//         setMessage('Group created successfully');
//         router.push(`/groups/${response.data.data}`);
//       } else {
//         setMessage('Failed to create group. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error creating group:', error);
//       setMessage('Error creating group');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
//       <h1 className="text-2xl font-bold mb-6">Create a New Group</h1>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <div className="mb-4">
//           <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
//             Group Name
//           </label>
//           <input
//             type="text"
//             name="groupName"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
//             placeholder="Enter group name"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <input
//             type="text"
//             name="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
//             placeholder="Enter description"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="additionalUserIds" className="block text-sm font-medium text-gray-700">
//             Additional User IDs (comma-separated)
//           </label>
//           <input
//             type="text"
//             name="additionalUserIds"
//             value={additionalUserIds}
//             onChange={(e) => setAdditionalUserIds(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
//             placeholder="Enter additional user IDs"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
//         >
//           Create Group
//         </button>
//       </form>

//       {message && (
//         <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateGroupPage;
