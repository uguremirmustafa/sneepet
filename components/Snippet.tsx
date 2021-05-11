// import React, { useState } from 'react';

// let today: Date = new Date();

// export default function Snippet({ id, data, user, ...actions }) {
//   const {
//     title,
//     author: { name: authorName },
//     created_at,
//     updated_at,
//     language: { name, slug },
//     likes_aggregate: {
//       aggregate: { count },
//     },
//     code,
//     description,
//     likes,
//   } = data.snippets_by_pk;
//   const edited = created_at !== updated_at;

//   const timeAgo = formatRelative(Date.parse(edited ? updated_at : created_at), today, {
//     weekStartsOn: 1,
//   });

//   const userLiked = likes.filter((item) => item.user_id === user?.sub).length > 0;

//   return (
//     <>
//       <div className="meta">
//         <h1 className="title">{title}</h1>
//         <div className="flex">
//           <h3 className="author">@{authorName ? authorName : 'unknown user'}</h3>
//           <p className="time">
//             {edited && <p>edited</p>}
//             {timeAgo}
//           </p>
//         </div>
//         <div className="flex">
//           <div className="language">
//             <Link href={`/language/${slug}`}>{name}</Link>
//           </div>
//           <div className="like">
//             <p>{count === 0 ? 'no likes' : count > 1 ? `${count} likes` : '1 like'}</p>
//             <svg
//               viewBox="0 0 24 24"
//               className={userLiked ? 'liked' : ''}
//               onClick={
//                 userLiked ? () => actions.handleUnlike(likeId) : () => actions.handleLike(id)
//               }
//             >
//               <path fill="none" d="M0 0H24V24H0z" />
//               <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
//             </svg>
//           </div>
//         </div>
//       </div>
//       <div className="content">
//         <div className="description">
//           <h3>Description</h3>
//           <p>{description}</p>
//         </div>
//         <SyntaxHighlighter
//           style={materialOceanic}
//           wrapLines={true}
//           language={name}
//           lineProps={{ style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
//           customStyle={{
//             borderRadius: '4px',
//             padding: '20px',
//             fontSize: '13px',
//             boxShadow: '0px 1px 30px -3px rgba(1,1,1,0.1)',
//             width: '100%',
//             fontWeight: '600',
//             fontFamily: 'Nunito',
//           }}
//         >
//           {code}
//         </SyntaxHighlighter>
//       </div>
//     </>
//   );
// }
