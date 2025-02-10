import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

import { nanoid } from 'nanoid';
const Products = () => {
	const [userInput, setuserInput] = useState('');
	const [updatedTitle, setUpdatedTitle] = useState('');
	const [updatedDescription, setupdatedDescription] = useState('');

	const queryClient = useQueryClient();

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			try {
				let response = await axios.get('https://fakestoreapi.com/products').then((res) => res.data);
				return response;
			} catch (error) {
				console.log(error?.message);
			}
		},
	});

	// mutation to add a new product
	const mutation = useMutation({
		mutationFn: async (newProduct) => {
			const res = await axios.post('https://fakestoreapi.com/products', newProduct);
			return res.data;
		},
		onSuccess: (newProduct) => {
			queryClient.setQueryData(['products'], (oldData) => [newProduct, ...oldData]);
			setuserInput('');
		},
		onError: (error) => {
			console.error('Error adding product:', error.message);
		},
	});

	// mutation to delete a product

	const deleteMutation = useMutation({
		mutationFn: async (productId) => {
			return await axios.delete(`https://fakestoreapi.com/products/${productId}`).then((res) => res.data);
		},
		onSuccess: (data, productId) => {
			queryClient.setQueryData(['products'], (curEle) => {
				return curEle.filter((product) => product.id !== productId);
			});
		},
	});

	// update mutation
	const updateMutation = useMutation({
		mutationFn: async (productId) => {
			const { value: formValues } = await Swal.fire({
				title: 'Multiple inputs',
				html: `
    <input id="swal-input1" class="swal2-input">
    <input id="swal-input2" class="swal2-input">
  `,
				focusConfirm: false,
				preConfirm: () => {
					return [document.getElementById('swal-input1').value, document.getElementById('swal-input2').value];
				},
			});

			if (formValues) {
				const [ title, description ] = formValues;
				

				setUpdatedTitle(title)
				setupdatedDescription(description)
			}
			return await axios.patch(`https://fakestoreapi.com/products/${productId}`, { title: updatedTitle, description: updatedDescription }).then((res) => res.data);

		},
		onSuccess: (data, productId) => {
			console.log(data);
			

			queryClient.setQueryData([ 'products' ], (products) => {
				console.log(products);
				console.log(updatedTitle);
				
				return products.map((product) => {
					return productId === product.id ? { ...product, title: updatedTitle, description: updatedDescription } : product;	
				});
			});
		},
		onError: (e) => {
			console.log(e);
			
		}
	});

	const handleSubmit = () => {
		if (userInput.trim()) {
			const newProduct = {
				title: userInput,
				description: 'loremdhsflfdhsl',
				id: nanoid(),
			};

			mutation.mutate(newProduct);
		}
	};

	if (isLoading) {
		return <div>Loading</div>;
	}
	if (isError) {
		return <div>error :{error?.message && 'Network error'}</div>;
	}
	return (
		<>
			<div>
				<input type='text' onChange={(e) => setuserInput(e.target.value)} value={userInput} />
				<button onClick={handleSubmit}>post</button>
			</div>
			<div>
				{data?.map(({ title, price, description, id }) => (
					<div key={id}>
						<h1>{title}</h1>
						<p>{price}</p>
						<p>{description}</p>
						<button onClick={() => deleteMutation.mutate(id)}>delete</button>
						<button onClick={() => updateMutation.mutate(id)}>update</button>
					</div>
				))}
			</div>
		</>
	);
};

export default Products;
