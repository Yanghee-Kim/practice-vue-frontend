<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import * as IGrid from 'aui-grid';
    import AUIGrid from '@/static/AUIGrid-Vue/AUIGridT.vue';
	import { getUserList, insertUser, updateUser, deleteUser } from '@/api/user/userApi';

	const userRolekeyValueListRef = ref<any>([{ code: 'ADMIN', value: '관리자' }, { code: 'USER', value: '사용자' }]);
	const useYnkeyValueListRef = ref<any>([{ code: 'Y', value: '사용' }, { code: 'N', value: '미사용' }]);

	// ****************************************
    // 그리드 InstanceType
	// ****************************************
	type AUIGrid = InstanceType<typeof AUIGrid>;

	// ****************************************
	// 그리드 객체
	// ****************************************
	const myGrid = ref<AUIGrid | null>(null);

	// ****************************************
    // 그리드 칼럼 레이아웃 정의
	// ****************************************
	const columnLayout: IGrid.Column[] = [
		{
			dataField: 'user_id',
			headerText: '사용자 ID',
			width: 120,
			editable: false
		},
		{
			dataField: 'login_id',
			headerText: '로그인 ID',
			width: 150,
		},
		{
			dataField: 'user_nm',
			headerText: '사용자명',
			width: 120,
		},
		{
			// format
			dataField: 'user_hp_no',
			headerText: '휴대폰번호',
			width: 150,
			editRenderer: {
				type: IGrid.EditRendererKind.MaskEditRenderer,
				mask: "999-9999-9999", // 숫자 3자리-4자리-4자리 강제
			}
		},
		{
			// dropdown
			dataField: 'user_role',
			headerText: '권한',
			width: 100,
			labelFunction: (rowIndex, columnIndex, value) => {
				let retStr = value;
				const keyValueList = userRolekeyValueListRef.value;
				for (let i = 0, len = keyValueList.length; i < len; i++) {
					if (keyValueList[i]['code'] === value) {
						retStr = keyValueList[i]['value'];
						break;
					}
				}
				return retStr;
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				keyField: 'code', // key 에 해당되는 필드명
				valueField: 'value', // value 에 해당되는 필드명
				listFunction: () => {
					return userRolekeyValueListRef.value; //key-value Object 로 구성된 리스트
				}
			}
		},
		{
			// dropdown
			dataField: 'use_yn',
			headerText: '사용여부',
			width: 100,
			labelFunction: (rowIndex, columnIndex, value) => {
				let retStr = value;
				const keyValueList = useYnkeyValueListRef.value;
				for (let i = 0, len = keyValueList.length; i < len; i++) {
					if (keyValueList[i]['code'] === value) {
						retStr = keyValueList[i]['value'];
						break;
					}
				}
				return retStr;
			},
			editRenderer: {
				type: IGrid.EditRendererKind.DropDownListRenderer,
				keyField: 'code', // key 에 해당되는 필드명
				valueField: 'value', // value 에 해당되는 필드명
				listFunction: () => {
					return useYnkeyValueListRef.value; //key-value Object 로 구성된 리스트
				}
			}
		},
		{
			dataField: 'reg_id',
			headerText: '등록자',
			width: 120,
			editable: false
		},
		{
			dataField: 'reg_dtm',
			headerText: '등록일시',
			width: 160,
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd HH:MM:ss',
			formatString: 'yyyy-mm-dd HH:MM:ss',
			editable: false
		},
		{
			dataField: 'upd_id',
			headerText: '수정자',
			width: 120,
			editable: false
		},
		{
			dataField: 'upd_dtm',
			headerText: '수정일시',
			width: 160,
			dataType: 'date',
			dateInputFormat: 'yyyy-mm-dd HH:MM:ss',
			formatString: 'yyyy-mm-dd HH:MM:ss',
			editable: false
		}
	];


	// ****************************************
    // 그리드 속성 정의
	// ****************************************
	const gridProps: IGrid.Props = {
		width: '100%',
		height: 480,
		selectionMode: 'multipleCells',
		editable: true,
		showRowCheckColumn: true,
		showRowAllCheckBox: true,
		softRemoveRowMode: false
		// selectionMode: 'singleRow',
		// displayTreeOpen: true,
		// 일반 데이터를 트리로 표현할지 여부(treeIdField, treeIdRefField 설정 필수)
		// flat2tree: true,
		// 행의 고유 필드명
		// rowIdField: 'rowId',
		// 트리의 고유 필드명
		// treeIdField: 'id',
		// 계층 구조에서 내 부모 행의 treeIdField 참고 필드명
		// treeIdRefField: 'parent'
	};

	// ****************************************
    // 그리드 이벤트 세팅
	// ****************************************
	const setupGridEvents = () => {
		const grid = myGrid.value as AUIGrid;

		// 그리드 ready 이벤트 바인딩
		grid.bind(IGrid.EventKind.Ready, (event: IGrid.ReadyEvent) => {
			console.log(event);
		});

		// 그리드 cellClick
		grid.bind(IGrid.EventKind.CellClick, (event: IGrid.CellClickEvent) => {
			console.log(event.value);
		});
	};

	// ****************************************
    // 행추가
	// ****************************************
	const addRow = () => {
		const grid = myGrid.value as AUIGrid;

		// 그리드의 편집 인푸터가 열린 경우 에디팅 완료 상태로 만듬.
		grid.forceEditingComplete(null);

		let item: any = {
			use_yn: 'Y'
		};
		
		grid.addRow(item, 'last');
	};

	// ****************************************
    // 행삭제
	// ****************************************
	const removeRow = () => {
		const grid = myGrid.value as AUIGrid;
		grid.removeRow('selectedIndex');
	};

	// ****************************************
    // 행 완전 삭제
	// ****************************************
	const removeSoftRows = () => {
		const grid = myGrid.value as AUIGrid;

		const removedRows: any[] = grid.getRemovedItems(true);

		if (removedRows.length === 0) {
			alert('삭제 처리되어 마크된 행이 없습니다.');
			return;
		}

		// softRemoveRowMode 가 true 일 때 삭제를 하면 그리드 상에 마크가 되는데
		// 이를 실제로 그리드에서 삭제 함
		if (window.confirm('다시 복구 할 수 없습니다. 삭제 하시겠습니까?')) {
			grid.removeSoftRows();
		}
	};

	// ****************************************
    // 행복원
	// ****************************************
	const restoreSoftRow = () => {
		const grid = myGrid.value as AUIGrid;

		// 선택 행 삭제 취소
		grid.restoreSoftRows('selectedIndex');
	};

	// ****************************************
    // 데이터 조회
	// ****************************************
	const requestGridData = async () => {
		const grid = myGrid.value as AUIGrid;

		const data = await getUserList();

		console.log(data);

		// 그리드에 데이터 삽입
		grid.setGridData(data);
	};

	// ****************************************
    // 데이터 저장
	// ****************************************
	const saveData = async () => {
		const grid = myGrid.value as AUIGrid;
		const addData = grid.getAddedRowItems();
		const editData = grid.getEditedRowItems();

		if(addData.length === 0 && editData.length === 0) {
			alert('저장할 데이터가 없습니다.');
			return;
		}

		const invalid = [...addData, ...editData].find((r: any) => !r.login_id || String(r.login_id).trim() === '');
		if (invalid) {
			alert('로그인 ID는 필수입니다.');
			return;
		}

		try {
			if(confirm('저장 하시겠습니까?')) {
				if (addData.length > 0) {
					console.log("추가 데이터 있음");
					console.log(addData);
					await insertUser(addData);
				}
	
				if (editData.length > 0) {
					console.log("수정 데이터 있음");
					console.log(editData);
					await updateUser(editData);
				}
	
				alert('저장 완료되었습니다.');
				requestGridData();
			}
		} catch (e) {
			console.error(e);
			alert('저장 실패하였습니다.');
		}
	};

	// ****************************************
    // 데이터 삭제
	// ****************************************
	const deleteData = async () => {
		const grid = myGrid.value as AUIGrid;

		const checked = grid.getCheckedRowItems();

		if (checked.length === 0) {
			alert('삭제할 행을 선택해주세요.');
			return;
		}

		const rows = checked.map((r: any) => r.item);

		try {
			if(confirm('삭제 하시겠습니까?')) {
				await deleteUser(rows);
			}

			alert('삭제 완료되었습니다.');
			requestGridData();
		} catch (e) {
			console.error(e);
			alert('삭제 실패하였습니다.');
		}
	};

	// ****************************************
    // onMounted
	// ****************************************
    onMounted(() => {
		console.log('UserView onMounted');
		
		// 최초 마운팅 될 때 그리드 이벤트 세팅
		setupGridEvents();

		// 최초 마운팅 될 때 그리드 데이터 조회시키기
		requestGridData();
	});

</script>
<template>
	<div>
		<h1>사용자 관리</h1>
		<div>
			<div>
				<button class="btn" @click="requestGridData">조회</button>
				<button class="btn" @click="addRow">행 추가</button>
				<button class="btn" @click="removeRow">행 삭제</button>
				<!-- <button class="btn" @click="removeSoftRows">행 완전 삭제</button> -->
				<!-- <button class="btn" @click="restoreSoftRow">삭제 취소</button> -->
				<button class="btn" @click="saveData">저장</button>
				<button class="btn" @click="deleteData">삭제</button>
			</div>
		</div>
        <AUIGrid ref="myGrid" :gridProps="gridProps" :columnLayout="columnLayout"/>
	</div>
</template>