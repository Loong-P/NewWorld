<template>
<div class="app-container calendar-list-container">
  <!-- 搜索栏 -->
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="车次的名称" v-model="listQuery.name">         
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
		<el-table :data="data" v-loading="listLoding" element-loading-text="給我一點時間" border fit highlight-current-row style="width:100%">
			<el-table-column type="index" align="center" width="35" >
				<template slot-scope="scope">
          <span>
            {{scope.row.id}}
          </span>
        </template>
			</el-table-column>
			<el-table-column  align="center" label="到达车次" width="200">
        <template>
          <span>
            {{scope.row.arriveName}}
          </span>
        </template>       
      </el-table-column>
            <el-table-column  align="center" label="到达时间" width="200">
              <template>               
                  <span>{{scope.row.arriveDate |parseTime('{y}--{m}-{d} {h}:{i}')}} </span>               
              </template>
            </el-table-column>
            <el-table-column  align="center" label="轨道" width="200">
              <template>                
                <span>{{scope.row.trackNum}}</span>              
              </template>
            </el-table-column>
            <el-table-column  align="center" label="出发时间" width="200">
              <template>                
                <span>{{scope.row.outSetDate |parseTime('{y}--{m}-{d} {h}:{i}')}}</span>              
              </template>
            </el-table-column>
            <el-table-column  align="center" label="状态" width="200">
              <template>                
                <span>{{scope.row.status}}</span>              
              </template>
            </el-table-column>
			<!-- 表格操作工具栏 -->
			<el-table-column label="操作" align="center" width="150">
				<template solt-scope="scope">
					<!-- 行内编辑 -->
					<el-button :type="!scope.row.isedit ? 'primary' : 'success'" size="small" @click="handleRowEdit(scope.$index, scope.row)">{{!scope.row.isedit ? '编辑' : '确定'}}</el-button>	
					<el-button type="info" v-show="scope.row.isedit" size="small" @click="cancelRowEdit(scope.$index, scope.row)">取消</el-button>	

					<!-- 删除提示tooltip -->
					<el-popover ref="popoverDelete" placement="top"  v-model="scope.row.visible">
						<p>确定要删除这条数据吗?</p>
						<div style="text-align: center;">
							<el-button size="mini" type="success" @click="scope.row.visible = false">取消</el-button>
							<el-button size="mini" type="danger" @click="handleRowDel(scope.$index, scope.row)">确定</el-button>
						</div>
						<el-button type="danger" v-show="!scope.row.isedit" size="small" slot="reference" @click="scope.row.visible = true">删除</el-button>
					</el-popover>
				</template>
			</el-table-column>
			<!-- 表格操作工具栏 End-->
		</el-table>
		<!-- 列车信息表格 End-->

    <!-- 分页栏 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 分页栏 End -->

<!-- 弹出对话框层-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFornVisible">
      <el-form rules="rules" ref="dataForm" :model="trainInfo" label-position="left">
        <el-form-item label="到达车次" prop="arriveName">
          <el-input type="text" v-model="trainInfo.arriveName" ></el-input>
        </el-form-item>
        <el-form-item label="出发车次" prop="outSetName">
          <el-input type="text" v-model="trainInfo.outSetName" ></el-input>
        </el-form-item>
        <el-form-item label="股道" prop="trackNum">
          <el-input v-model="trainInfo.trackNum" type="munber">
          </el-input>
        </el-form-item>
        <el-form-item label="到达时间" prop="arriveDate">
          <el-date-picker v-model="trainInfo.arriveDate" type="datetime" placeholder="请选择时间！">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出发时间" prop="outSetDate">
          <el-date-picker v-model="trainInfo.outSetDate" type="datetime" placeholder="请选择时间!">
          </el-date-picker>
        </el-form-item>
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>    
    </el-dialog>
<!-- 弹出对话框层 End-->
  </div>
</template>

<script>
import request from "@/utils/request";

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
      trainInfo:{
        id:undefined,
        arriveName:'',
        outSetName:'',
        arriveDate:new Date(),
        outSetDate:new Date(),
        trackNum:1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        arriveName: [{ required: true, message: '到达车次必填', trigger: 'change' }],
        arriveDate: [{ type: 'date', required: true, message: '到达时间必填', trigger: 'change' }],
        outSetDate: [{ type: 'date', required: true, message: '出发时间必填', trigger: 'change' }],
        outSetName: [{ required: true, message: '出发车次必填', trigger: 'blur' }],
        trackNum: [{ required: true, message: '股道序号必填', trigger: 'blur' },
        {type:'number',min:1,max:13,message:'轨道的序号在1-13内的范围',trigger:'blur'}
        ]
      },
    };
  },
  mounted() {
    request({
      url: "/getBaseInfo",
      methods: "post",
      data: { a: 1, b: 2 }
    }).then(
      response => {
        console.log("ajax response!!!!!");
      },
      response => {
        console.log("ajax can not work!!!");
      }
    );
  }
};
</script>

<style lang="css" scoped>

</style>
