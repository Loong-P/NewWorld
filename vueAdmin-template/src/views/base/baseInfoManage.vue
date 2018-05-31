<template>
<div class="app-container calendar-list-container">
  <!-- 搜索栏 -->
  <div class="filter-container">
    <el-input  style="width: 200px;" class="filter-item" placeholder="车次的名称" v-model="listQuery.name">         
    </el-input>
    <el-input  style="width: 200px;" class="filter-item" placeholder="开始时间" v-model="listQuery.startTime">         
    </el-input>
    <el-input  style="width: 200px;" class="filter-item" placeholder="结束时间" v-model="listQuery.endTime">         
    </el-input>
    <el-button class="filter-item" style="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    <el-button class="filter-item" style="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    <el-button class="filter-item" style="primary" icon="el-icon-upload el-icon--right" @click="handleUploade">导入</el-button>
  </div>
  <!-- 搜索栏End -->

    <!-- 列车信息数据表格 -->
	<el-table :data="list"  element-loading-text="給我一點時間" border fit highlight-current-row style="width:100%">
		<el-table-column  align="center" label="到达车次" width="200">
      <template slot-scope="scope">
        <span>
          {{scope.row.arriveName}}
        </span>
      </template>       
    </el-table-column>
          <el-table-column  align="center" label="到达时间" >
            <template slot-scope="scope">               
                <span>{{scope.row.arriveDate |parseTime('{y}-{m}-{d} {h}:{i}') }} </span>               
            </template>
          </el-table-column>
          <el-table-column  align="center" label="轨道" >
            <template slot-scope="scope">                
              <span>{{scope.row.trackNum}}</span>              
            </template>
          </el-table-column>
          <el-table-column  align="center" label="出发时间" >
            <template slot-scope="scope">                
              <span>{{scope.row.outSetDate |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>              
            </template>
          </el-table-column>
          <el-table-column  align="center" label="状态" >
            <template slot-scope="scope">                
              <span>{{scope.row.status}}</span>              
            </template>
      </el-table-column>			         
	</el-table>
		<!-- 列车信息表格 End-->
    <!--对话框-->
<el-dialog title="基础信息" :visible.sync="dialogFormVisible" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
  <el-form :model="trainInfo">
    <el-form-item label="到达车次">
      <el-input type="text" v-model="trainInfo.arriveName"> </el-input>
    </el-form-item>
    <el-form-item lable="到达时间">
      <el-date-picker type="datetime" v-model="trainInfo.arriveDate"></el-date-picker>
    </el-form-item>
    <el-form-item label="轨道">
      <el-input v-model="trainInfo.trackNum"></el-input>
    </el-form-item>
    <el-form-item lable="出发时间">
      <el-date-picker type="datetime" v-model="trainInfo.outSetDate"></el-date-picker>
    </el-form-item>
    <el-form-item label="出发车次">
      <el-input v-model="trainInfo.outSetName"></el-input>
    </el-form-item>
   </el-form>
</el-dialog>
<!---->
  </div>
</template>



<script>
import request from "@/utils/request";
import { parseTime } from "@/utils";
import { fetchList } from "@/api/train";
export default {
  data() {
    return {
      tablekey: 0,
      list: null,
      total: null,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        name: undefined,
        startTime: undefined,
        endTime: undefined
      },
      trainInfo: {
        id: undefined,
        arriveName: "",
        outSetName: "",
        arriveDate: new Date(),
        outSetDate: new Date(),
        trackNum: 1
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      rules: {
        arriveName: [
          { required: true, message: "到达车次必填", trigger: "change" }
        ],
        arriveDate: [
          {
            type: "date",
            required: true,
            message: "到达时间必填",
            trigger: "change"
          }
        ],
        outSetDate: [
          {
            type: "date",
            required: true,
            message: "出发时间必填",
            trigger: "change"
          }
        ],
        outSetName: [
          { required: true, message: "出发车次必填", trigger: "blur" }
        ],
        trackNum: [
          { required: true, message: "股道序号必填", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 13,
            message: "轨道的序号在1-13内的范围",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.list;
        this.total = response.count;
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleCreate() {
      //新添加
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUploade() {}
  }
};
</script>

<style lang="css" scoped>
</style>
