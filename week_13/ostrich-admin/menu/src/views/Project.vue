<template>
  <div class="page">
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>项目管理</span>
          <el-button @click="addClick" class="button" type="primary"
            >新增</el-button
          >
        </div>
      </template>
      <el-table
        class="tableSty"
        ref="tableRef"
        highlight-current-row
        :data="table.tableData"
        @current-change="handleCurrentChange"
        :row-style="{
          fontSize: '14px',
          color: '#303133',
          height: '50px',
          boxSizing: 'border-box',
        }"
        :fit="true"
      >
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column prop="id" width="100" label="id"></el-table-column>
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="label" label="标签" width="200" />
        <el-table-column prop="created_at" label="创建日期" />
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="page.current"
          :page-sizes="[10, 20, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="table.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="showEditWin"
      destroy-on-close
      :append-to-body="true"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      :width="500"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="tag in form.labels"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            size="large"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="form.inputVisible"
            ref="saveTagInput"
            v-model="form.inputValue"
            class="input-new-tag"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ New Tag</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doCreate">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { computed, nextTick, onMounted, reactive, ref } from "vue";

import { getProjectList, addProject } from "@/api/project.api";
import { ElMessage } from "element-plus";
import moment from "moment";

export default {
  setup() {
    const table = reactive({
      tableData: [],
      total: 0,
    });
    const page = reactive({
      current: 1,
      pageSize: 10,
      total: 1,
    });
    const form = reactive({
      name: "",
      labels: [],
      inputVisible: false,
      inputValue: "",
    });
    //新增/编辑弹窗
    const showEditWin = ref(false);

    onMounted(() => {
      methods.initTableData();
    });

    const methods = {
      async initTableData() {
        const res = await getProjectList({
          page: page.current,
          pageSize: page.pageSize,
        });

        if (res.code === 200) {
          let list = res.data.list.map((row) => {
            //时间格式化
            row.created_at = moment(row.created_at).format(
              "YYYY/MM/DD hh:mm:ss"
            );
            return row;
          });
          console.log("resList", list);
          table.tableData = list;
          table.total = res.data.total;
        }
      },
      handleSizeChange(d) {
        page.pageSize = d;
        methods.initTableData();
      },
      handleCurrentChange(d) {
        page.current = d;
        methods.initTableData();
      },
      closeDetailWin() {
        methods.initTableData();
        detailWin.show = false;
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      addClick() {
        showEditWin.value = true;
      },
      showInput() {
        form.inputVisible = true;
      },
      handleInputConfirm() {
        form.inputVisible = false;
        if (form.inputValue) {
          form.labels.push(form.inputValue);
          form.labels = Array.from(new Set(form.labels));
        }
        form.inputValue = "";
      },
      handleClose(tag) {
        console.log("handleClose>>>", tag);
        form.labels = form.labels.filter((item) => item !== tag);
      },
      async doCreate() {
        let result = await addProject({
          name: form.name,
          label: form.labels,
        });
        if (result.code === 200) {
          ElMessage({
            message: "项目创建成功",
            type: "success",
            duration: 2000,
          });
          showEditWin.value = false;
          methods.initTableData();
        }
      },
    };

    return {
      showEditWin,
      table,
      page,
      form,
      ...methods,
    };
  },
};
</script>
<style scoped lang="less">
.page {
  padding: 10px;
  .card {
    .card-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      span {
        position: absolute;
        left: 0;
      }
    }
    .tableSty {
      width: 100%;
    }
    .pagination {
      padding: 10px;
      display: flex;
      width: 100%;
      justify-content: flex-end;
    }
  }
  .button-new-tag {
    margin-left: 10px;
  }
}
</style>
