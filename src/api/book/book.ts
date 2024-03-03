import service from '@/utils/request'

export const useBookApi = (id: number) => {
	return service.get('/book/book/' + id)
}

export const useBookSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/book/book', dataForm)
	} else {
		return service.post('/book/book', dataForm)
	}
}