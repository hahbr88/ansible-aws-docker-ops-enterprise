# 08. AWS 동적 인벤토리(Dynamic Inventory)

## 왜 필요한가?
- EC2는 IP가 바뀌거나, 인스턴스가 늘어나거나 줄어듭니다.
- 정적 hosts.ini로 관리하면 금방 깨집니다.

## aws_ec2 플러그인 사용
`inventories/aws/aws_ec2.yml`를 사용하면, AWS API로 EC2 목록을 가져와 인벤토리로 만듭니다.

### 인벤토리 출력
```bash
ansible-inventory -i inventories/aws/aws_ec2.yml --graph
```

### 특정 태그 Role별 그룹 예시
- `Role=web` 인 인스턴스는 `role_web` 그룹으로 자동 구성됩니다.

### 실제 플레이 적용
```bash
ansible-playbook -i inventories/aws/aws_ec2.yml playbooks/03_role_web.yml
```
