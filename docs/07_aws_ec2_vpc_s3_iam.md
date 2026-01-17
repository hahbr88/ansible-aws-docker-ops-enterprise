# 07. AWS (VPC/EC2/S3) 실습

## 실습 순서
1) VPC + Subnet + Security Group 생성
2) EC2 인스턴스 생성(태그 포함)
3) S3 버킷 생성
4) 리소스 정리(Cleanup)

## 비용 주의
EC2는 생성 즉시 과금이 될 수 있습니다.
실습이 끝나면 반드시 Cleanup 플레이북을 실행하세요.

## 실행 예시
```bash
ansible-playbook playbooks/20_aws_create_vpc.yml -e aws_region=ap-northeast-2
ansible-playbook playbooks/21_aws_create_ec2.yml -e aws_region=ap-northeast-2
ansible-playbook playbooks/22_aws_s3_bucket.yml -e aws_region=ap-northeast-2

# 정리
ansible-playbook playbooks/23_aws_cleanup.yml -e aws_region=ap-northeast-2
```
