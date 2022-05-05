/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : orchid

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2022-05-05 17:29:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建日期',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新日期',
  `delete_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除日期',
  `title` varchar(60) NOT NULL COMMENT '菜单标题',
  `type` varchar(60) NOT NULL COMMENT '类型',
  `icon` varchar(60) DEFAULT NULL COMMENT '图标',
  `path` varchar(200) NOT NULL COMMENT '路径',
  `parent_id` int(11) DEFAULT '0' COMMENT '父级id',
  `level` int(11) DEFAULT '0' COMMENT '子级数量',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否显示 0-显示 1-不显示',
  `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
  `sort` int(11) NOT NULL DEFAULT '255' COMMENT '排序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_634d60b1d936f681e80d1457c3` (`path`),
  KEY `FK_138ac50bdb6c58b1bb53ed3dd98` (`parent_id`),
  CONSTRAINT `FK_138ac50bdb6c58b1bb53ed3dd98` FOREIGN KEY (`parent_id`) REFERENCES `resources` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of resources
-- ----------------------------
INSERT INTO `resources` VALUES ('1', '2022-04-24 14:29:53.005882', '2022-05-05 17:20:50.423690', null, '系统管理', 'menu', '', 'system', null, '0', '0', '', '5');
INSERT INTO `resources` VALUES ('2', '2022-04-24 14:48:40.560951', '2022-05-05 17:14:09.000000', null, '广告列表', 'menu', '', 'advertise', '1', '0', '0', 'system/advertise', '0');
INSERT INTO `resources` VALUES ('3', '2022-04-24 14:49:55.785851', '2022-05-05 17:26:22.450429', null, '通知公告', 'menu', '', 'notice', '1', '0', '0', 'system/notice', '0');
INSERT INTO `resources` VALUES ('4', '2022-04-24 14:50:17.983266', '2022-05-05 17:14:27.000000', null, '登录日志', 'menu', '', 'loginLogger', '1', '0', '0', 'system/loginLogger', '0');
INSERT INTO `resources` VALUES ('5', '2022-04-24 14:51:14.667585', '2022-05-05 17:14:37.000000', null, '友情链接', 'menu', '', 'link', '1', '0', '0', 'system/link', '0');
INSERT INTO `resources` VALUES ('6', '2022-04-24 14:52:24.681252', '2022-05-05 17:20:48.294522', null, '文章管理', 'menu', '', 'article', null, '0', '0', '', '4');
INSERT INTO `resources` VALUES ('7', '2022-04-24 14:52:48.521522', '2022-05-05 17:20:39.226436', null, '权限管理', 'menu', '', 'permission', null, '0', '0', '', '3');
INSERT INTO `resources` VALUES ('8', '2022-04-24 14:53:10.648487', '2022-05-05 17:20:35.429055', null, '导航管理', 'menu', '', 'navigation', null, '0', '0', '', '2');
INSERT INTO `resources` VALUES ('9', '2022-04-24 14:53:59.526971', '2022-05-05 17:20:16.612798', null, '首页', 'menu', '', '', null, '0', '0', '', '1');
INSERT INTO `resources` VALUES ('10', '2022-04-24 15:10:42.985621', '2022-05-05 17:11:22.000000', null, '分类列表', 'menu', '', 'category', '6', '0', '0', 'article/category', '0');
INSERT INTO `resources` VALUES ('11', '2022-04-24 15:10:55.327911', '2022-05-05 17:11:31.000000', null, '标签列表', 'menu', '', 'tag', '6', '0', '0', 'article/tag', '0');
INSERT INTO `resources` VALUES ('12', '2022-04-24 15:11:50.501756', '2022-05-05 17:11:44.000000', null, '文章列表', 'menu', '', 'articleList', '6', '0', '0', 'article/articleList', '0');
INSERT INTO `resources` VALUES ('13', '2022-04-24 15:12:51.839167', '2022-05-05 17:01:57.000000', null, '资源列表', 'menu', '', 'resource', '7', '1', '0', 'permission/resource', '0');
INSERT INTO `resources` VALUES ('14', '2022-04-24 15:13:11.534105', '2022-05-05 17:12:23.000000', null, '角色列表', 'menu', '', 'roles', '7', '0', '0', 'permission/roles', '0');
INSERT INTO `resources` VALUES ('15', '2022-04-24 15:13:27.133391', '2022-05-05 17:12:50.000000', null, '管理员列表', 'menu', '', 'manager', '7', '0', '0', 'permission/manager', '0');
INSERT INTO `resources` VALUES ('16', '2022-04-24 15:14:08.854752', '2022-05-05 11:26:42.064790', null, '导航列表', 'menu', '', 'navigationList', '8', '0', '0', 'navigation', '0');
INSERT INTO `resources` VALUES ('17', '2022-04-24 15:17:53.717975', '2022-05-05 11:26:42.100447', null, '首页', 'menu', '', 'dashboard', '9', '0', '0', 'dashboard', '0');
INSERT INTO `resources` VALUES ('18', '2022-04-27 10:02:57.493012', '2022-05-05 11:26:42.137288', null, '获取列表', 'button', '', 'menu/get', '16', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('19', '2022-04-27 10:03:25.331552', '2022-05-05 11:26:42.172078', null, '删除导航', 'button', '', 'menu/delete', '16', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('20', '2022-04-27 10:03:57.661234', '2022-05-05 11:26:42.207683', null, '新增导航', 'button', '', 'menu/post', '16', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('21', '2022-04-27 10:05:43.294093', '2022-05-05 11:26:42.232247', null, '修改导航', 'button', '', 'menu/patch', '16', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('22', '2022-04-28 10:36:58.282289', '2022-05-05 11:26:42.257206', null, '获取列表', 'button', '', 'roles/get', '14', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('23', '2022-04-28 10:37:29.652307', '2022-05-05 11:26:42.299065', null, '新增角色', 'button', '', 'roles/post', '14', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('24', '2022-04-28 10:38:05.773550', '2022-05-05 11:26:42.340437', null, '角色修改', 'button', '', 'roles/patch', '14', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('25', '2022-04-28 10:39:14.387305', '2022-05-05 11:26:42.386791', null, '角色删除', 'button', '', 'roles/delete', '14', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('26', '2022-04-28 10:39:49.962536', '2022-05-05 11:26:42.422290', null, '获取列表', 'button', '', 'manager/get', '15', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('27', '2022-04-28 10:40:06.825769', '2022-05-05 11:26:42.457950', null, '新增管理员', 'button', '', 'manager/post', '15', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('28', '2022-04-28 10:40:27.330771', '2022-05-05 11:26:42.483266', null, '管理员修改', 'button', '', 'manager/patch', '15', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('29', '2022-04-28 10:41:00.002823', '2022-05-05 11:26:42.530151', null, '管理员删除', 'button', '', 'manager/delete', '15', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('30', '2022-04-28 10:48:13.245912', '2022-05-05 11:26:42.565182', null, '权限分配', 'button', '', 'roles/resources/patch', '14', '0', '0', '', '0');
INSERT INTO `resources` VALUES ('31', '2022-05-05 17:01:56.940931', '2022-05-05 17:07:02.698816', null, '获取资源', 'button', '', 'get/resource', '13', '0', '0', '', '0');
