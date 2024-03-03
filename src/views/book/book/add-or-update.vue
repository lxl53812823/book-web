<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="书名" prop="bookName">
					<el-input v-model="dataForm.bookName" placeholder="书名"></el-input>
				</el-form-item>
				<el-form-item label="作者" prop="author">
					<el-input v-model="dataForm.author" placeholder="作者"></el-input>
				</el-form-item>
				<el-form-item label="出版年份" prop="issueYear">
					<el-date-picker type="year" placeholder="出版年份" v-model="dataForm.issueYear"></el-date-picker>
				</el-form-item>
				<el-form-item label="ISBN" prop="isbn">
					<el-input v-model="dataForm.isbn" placeholder="ISBN"></el-input>
				</el-form-item>
				<el-form-item label="封面" prop="logo">
					<el-upload
					    v-model="dataForm.logo"
                    					:action="constant.uploadUrl"
                    					:headers="{ Authorization: cache.getToken() }"
                    					:before-upload="beforeUpload"
                    					:on-success="handleLogoSuccess"
                    					:show-file-list="false"
                    				>
                    					<el-button type="primary">上传封面</el-button>
                    				</el-upload>
				</el-form-item>
				<el-form-item label="描述" prop="bookDesc">
					<el-input v-model="dataForm.bookDesc" placeholder="描述"></el-input>
				</el-form-item>
				<el-form-item label="图书内容" prop="bookContent">
					<el-upload  v-model="dataForm.bookContent"
                                        					:action="constant.uploadUrl"
                                        					:headers="{ Authorization: cache.getToken() }"
                                        					:before-upload="beforeUpload"
                                        					:on-success="handleContentSuccess"
                                        					:show-file-list="false"
                                        				>
                                        					<el-button type="primary">上传图书</el-button>
                                        				</el-upload>
				</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useBookApi, useBookSubmitApi } from '@/api/book/book'
import constant from '@/utils/constant'
import cache from '@/utils/cache'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	bookName: '',
	author: '',
	issueYear: '',
	isbn: '',
	tenantId: '',
	version: '',
	deleted: '',
	creator: '',
	createTime: '',
	updater: '',
	updateTime: '',
	logo: '',
	bookDesc: '',
	bookContent: ''})
const handleLogoSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('上传失败：' + res.msg)
		return false
	}
        dataForm.logo=res.url
	Object.assign(dataForm, res.data)


}

const handleContentSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('上传失败：' + res.msg)
		return false
	}
        dataForm.bookContent=res.url
	Object.assign(dataForm, res.data)
	logo

}


const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('文件大小不能超过100M')
		return false
	}
	return true
}
const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getBook(id)
	}
}

const getBook = (id: number) => {
	useBookApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useBookSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
