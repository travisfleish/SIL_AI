// import React, { useEffect } from 'react';
// import Image from 'next/image';
// import { DEMO_CATEGORIES } from '../../utils/constants';
// import CategoryCard from './CategoryCard';
// import EnterpriseToolCard from './EnterpriseToolCard';
// import useScrollAnimation from '../../hooks/useScrollAnimation';
//
// // Create a simpler version of CategoryCard for mobile
// const MobileCategoryCard = ({ category, tools }) => {
//   // Filter tools that match this category
//   const categoryTools = tools.filter(tool => tool.category === category);
//
//   // If no tools match this category, don't render anything
//   if (categoryTools.length === 0) {
//     return null;
//   }
//
//   // Take the first tool from this category
//   const tool = categoryTools[0];
//
//   return (
//     <div className="mb-6 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center overflow-hidden">
//       {/* Category header */}
//       <div className="w-full bg-blue-100 py-2 px-3 text-center">
//         <span className="font-bold text-blue-800 text-lg">
//           {category}
//         </span>
//       </div>
//
//       {/* Simple image with no Next.js optimization */}
//       <img
//         src={tool.screenshot_url || '/default-screenshot.png'}
//         alt={`${tool.name} Screenshot`}
//         className="w-full h-auto"
//         style={{ maxHeight: '200px', objectFit: 'cover' }}
//       />
//
//       {/* Tool info */}
//       <div className="p-4 flex flex-col items-center w-full">
//         <h3 className="text-lg font-bold">
//           <a
//             href={tool.source_url}
//             className="text-blue-600 hover:underline"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             {tool.name}
//           </a>
//         </h3>
//
//         <p className="text-gray-600 text-center mt-2">
//           {tool.short_description}
//         </p>
//
//         {categoryTools.length > 1 && (
//           <div className="mt-2 text-sm text-gray-500">
//             + {categoryTools.length - 1} more in this category
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// const ToolGrid = ({ tools, selectedFilter, selectedCategory }) => {
//   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
//
//   // Log information about tools on mount and when tools change
//   useEffect(() => {
//     if (isMobile) {
//       console.log(`TOOLGRID MOUNTED - Filter: ${selectedFilter}, Tools: ${tools?.length || 0}`);
//
//       if (selectedFilter === 'personal') {
//         console.log('PERSONAL TOOLS:', {
//           totalCount: tools?.length || 0,
//           categories: [...new Set(tools?.map(t => t.category).filter(Boolean))]
//         });
//
//         // Check if tools match categories
//         DEMO_CATEGORIES.forEach(category => {
//           const matchCount = tools?.filter(t => t.category === category).length || 0;
//           console.log(`Category "${category}": ${matchCount} matching tools`);
//         });
//       }
//     }
//   }, [tools, selectedFilter, isMobile]);
//
//   const sectionAnimation = useScrollAnimation({
//     animation: 'fade-in',
//     duration: 600,
//     threshold: 0.05,
//   });
//
//   if (!tools || tools.length === 0) {
//     return (
//       <section className="p-6 w-full">
//         <div className="flex justify-center items-center min-h-[300px]">
//           <p className="text-gray-500 text-lg">
//             {tools
//               ? 'No tools found matching your criteria.'
//               : 'Loading tools...'}
//           </p>
//         </div>
//       </section>
//     );
//   }
//
//   const ToolCard = ({ tool, index }) => {
//     const animation = useScrollAnimation({
//       animation: 'fade-up',
//       delay: index * 100,
//       duration: 600,
//       threshold: 0.1,
//     });
//
//     return (
//       <div
//         ref={animation.ref}
//         style={animation.style}
//         className="mb-6 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center overflow-hidden"
//       >
//         {/* Full width image with no padding */}
//         <Image
//           src={tool.screenshot_url || '/default-screenshot.png'}
//           alt={`${tool.name} Screenshot`}
//           width={400}
//           height={250}
//           className="w-full h-auto object-cover"
//         />
//
//         {/* Content section */}
//         <div className="p-4 w-full">
//           <h3 className="text-lg font-bold">{tool.name}</h3>
//           <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
//             {selectedFilter === 'personal'
//               ? tool.category ||
//                 DEMO_CATEGORIES[index % DEMO_CATEGORIES.length]
//               : tool.sector || ''}
//           </span>
//           <p className="text-gray-600 text-center">{tool.short_description}</p>
//         </div>
//       </div>
//     );
//   };
//
//   const CategoryCardWrapper = ({ category, index }) => {
//     const animation = useScrollAnimation({
//       animation: 'fade-up',
//       delay: index * 100,
//       duration: 800,
//       threshold: 0.1,
//     });
//
//     return (
//       <div ref={animation.ref} style={animation.style}>
//         <CategoryCard
//           category={category}
//           tools={tools}
//           categoryIndex={index}
//           demoCategories={DEMO_CATEGORIES}
//         />
//       </div>
//     );
//   };
//
//   const EnterpriseCard = ({ tool, index }) => {
//     const animation = useScrollAnimation({
//       animation: 'fade-up',
//       delay: index * 100,
//       duration: 800,
//       threshold: 0.1,
//     });
//
//     return (
//       <div ref={animation.ref} style={animation.style}>
//         <EnterpriseToolCard tool={tool} />
//       </div>
//     );
//   };
//
//   // Mobile layout - DIFFERENT HANDLING FOR PERSONAL VS ENTERPRISE
//   if (isMobile) {
//     // Special handling for personal tools on mobile
//     if (selectedFilter === 'personal') {
//       return (
//         <section className="p-6 w-full">
//           <div className="w-full">
//             {/* Use the simpler MobileCategoryCard for personal view */}
//             {DEMO_CATEGORIES.map((category, index) => (
//               <MobileCategoryCard
//                 key={category}
//                 category={category}
//                 tools={tools}
//               />
//             ))}
//           </div>
//         </section>
//       );
//     }
//
//     // Regular mobile view for enterprise tools
//     return (
//       <section className="p-6 w-full">
//         <div className="w-full flex justify-center">
//           <div className="w-full max-w-md">
//             {tools.map((tool, index) => (
//               <ToolCard key={tool.id || index} tool={tool} index={index} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }
//
//   // Desktop - personal view
//   if (selectedFilter === 'personal') {
//     return (
//       <section
//         className="p-6 w-full"
//         ref={sectionAnimation.ref}
//         style={sectionAnimation.style}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
//           {DEMO_CATEGORIES.map((category, index) => (
//             <CategoryCardWrapper
//               key={category}
//               category={category}
//               index={index}
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }
//
//   // Desktop - enterprise view
//   return (
//     <section
//       className="p-8 w-full"
//       ref={sectionAnimation.ref}
//       style={sectionAnimation.style}
//     >
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
//         {tools.map((tool, index) => (
//           <EnterpriseCard key={tool.id || index} tool={tool} index={index} />
//         ))}
//       </div>
//     </section>
//   );
// };
//
// export default ToolGrid;