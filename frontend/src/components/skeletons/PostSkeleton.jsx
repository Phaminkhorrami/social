const PostSkeleton = () => {
	return (
		<div className='flex flex-col gap-4 w-full p-6 bg-[#16181C] rounded-lg border border-gray-700'>
			<div className='flex gap-4 items-center'>
				<div className='skeleton w-10 h-10 rounded-lg shrink-0'></div>
				<div className='flex flex-col gap-2'>
					<div className='skeleton h-3 w-24 rounded-lg'></div>
					<div className='skeleton h-2 w-32 rounded-lg'></div>
				</div>
			</div>
			<div className='skeleton h-48 w-full rounded-lg'></div>
			<div className='flex justify-between mt-4'>
				<div className='flex gap-6 items-center'>
					<div className='skeleton w-5 h-5 rounded-lg'></div>
					<div className='skeleton w-5 h-5 rounded-lg'></div>
					<div className='skeleton w-5 h-5 rounded-lg'></div>
					<div className='skeleton w-5 h-5 rounded-lg'></div>
				</div>
			</div>
		</div>
	);
};
export default PostSkeleton;
