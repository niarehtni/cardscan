<?php
namespace application\admin\controller;
use think\Controller;

class Redirurl extends controller
{
	public function index()
	{
		//���ںŵ�appid��secret
		$appid  = '���appid';
		$secret = '���secret';
		session_start();
		//�Ƿ��Ѿ����չ�code flase��δ���չ�
		if(empty($_SESSION['code'])&&!isset($_SESSION['code'])){
			if(isset($_GET['code'])){
				$_SESSION['code'] = $_GET["code"];
			}
			else{
				messageOutput("����Ƕ����Ź��ںŵײ��˵�����!",2);
				exit();
			}
		}
		//��һ��:ȡȫ��access_token
		if(empty($_SESSION['token'])&&!isset($_SESSION['token'])){
			$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$secret";
			$token = getJson($url);
			$_SESSION['token'] = $token["access_token"];
		}
		//�ڶ���:ȡ��openid
		if(empty($_SESSION['oauth2'])&&!isset($_SESSION['oauth2'])){
			$oauth2Url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=".$_SESSION['code']."&grant_type=authorization_code";
			$oauth2 = getJson($oauth2Url);
			$_SESSION['oauth2'] = $oauth2['openid'];
		}
		//������:����ȫ��access_token��openid��ѯ�û���Ϣ  
		$access_token = $_SESSION['token'];  
		//�ж�session���Ƿ����openid���������ʾ�ѵ�½��
		if(empty($_SESSION['openid'])){
			$openid = $_SESSION['oauth2'];  
			$get_user_info_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$access_token&openid=$openid&lang=zh_CN";
			$userinfo = getJson($get_user_info_url);
			$openid = (string)$userinfo['openid'];
			$sqlstr = "select * from administrator where openid='".$openid."';";
			//��ѯ�Ƿ����
			$result = doForSql($sqlstr);			
			//ȡid
			if($result->num_rows){
				$group = $result->fetch_assoc();
				$_SESSION['id'] = $group['id'];
			}
			else{
				//�Ƚ�openidд�����ݿ�
				$sqlstr = "insert into administrator(openid) values('".$openid."'); ";
				doForSql($sqlstr);	
				$sqlstr = "select id from administrator where openid='".$openid."';"; 
				$result = doForSql($sqlstr);			
				//ȡ��openid�����ݿ��ж�Ӧ��id
				if($result->num_rows){
					$group = $result->fetch_assoc();
					$_SESSION['id'] = $group['id'];
				}
			}
			//�û���Ϣ����session��
			$_SESSION['openid'] = $userinfo['openid'];
			$_SESSION['nickname'] = $userinfo['nickname'];
		}
		include "../application/admin/view/index/shouye.php";
	}
}
?>