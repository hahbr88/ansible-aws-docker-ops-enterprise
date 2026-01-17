# Ansible

## VSCode 에서 WSL 사용
![alt text](image.png)
![alt text](image-1.png)
### WSL 연결 또는 Linux 설치 없을 경우 배포판을 사용하여 설치 후 연동
### 목록 중 연결닫기 하면 다시 윈도우 파워 셸
![alt text](image-2.png)
## 윈도우즈에서 현재의 프로젝트 폴더를 WSL 의 Linux 폴더로 복제
## VSCode 실행, WSL 선택, 폴더 열기
![alt text](image-3.png)
## WSL 환경의 Git 재설정 필요
![alt text](image-4.png)
```
git config --global user.name "당신의 이름 또는 닉네임"
git config --global user.email "github에 등록된 이메일@example.com"
```

---
- Linux/WSL(권장), 또는 macOS
- Python 3.9+
- Ansible (ansible-core)
- AWS 자격증명(Access Key / Secret Key 또는 SSO/프로파일)


### 2) 설치
```bash
./scripts/bootstrap.sh
./scripts/check.sh
```
### 권한 문제 발생 시
```
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```
## Ubuntu/Debian이 PEP 668(Externally Managed Environment) 정책을 적용해서, 시스템 Python에 pip로 전역 설치를 막는 상황입니다(특히 Ubuntu 23.10+/24.04, Python 3.12에서 흔함).
## 가장 안전하고 깔끔한 해결은 레포 안에 venv(가상환경)를 만들고 거기에 Ansible/라이브러리를 설치
```
sudo apt update
sudo apt install -y python3-venv python3-pip python3-full
```
## 위의 실행 중 계정 비번 필요.
```
kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ sudo apt update
sudo apt install -y python3-venv python3-pip python3-full
[sudo] password for kimdy: 
Sorry, try again.
[sudo] password for kimdy: 
Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
 :
 :
```
```
python3 -m venv .venv
source .venv/bin/activate
```
```
python -m pip install -U pip setuptools wheel
python -m pip install "ansible>=9" ansible-lint molecule "molecule-plugins[docker]" docker
```
```
ansible-galaxy collection install -r requirements.yml
```
## 실행 환경 확인
```
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible-galaxy collection install -r requirements.yml
Starting galaxy collection install process
Nothing to do. All requested collections are already installed. If you want to reinstall them, consider using `--force`.
```

## source .venv/bin/activate 으로 실행 먼저 필요

## 1) 로컬에서 플레이북 실행 확인

```bash
ansible -i inventories/dev/hosts.ini all -m ping
```
```
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible -i inventories/dev/hosts.ini all -m ping
local | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/home/kimdy/ansible-aws-docker-ops-enterprise/.venv/bin/python3.12"
    },
    "changed": false,
    "ping": "pong"
}
```
---
```
ansible-playbook -i inventories/dev/hosts.ini playbooks/00_ping.yml
```
```
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible-playbook -i inventories/dev/hosts.ini playbooks/00_ping.yml
[ERROR]: The 'community.general.yaml' callback plugin has been removed. The plugin has been superseded by the option `result_format=yaml` in callback plugin ansible.builtin.default from ansible-core 2.13 onwards. This feature was removed from collection 'community.general' version 12.0.0.
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible --version
ansible [core 2.20.1]
  config file = /home/kimdy/ansible-aws-docker-ops-enterprise/ansible.cfg
  configured module search path = ['/home/kimdy/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /home/kimdy/ansible-aws-docker-ops-enterprise/.venv/lib/python3.12/site-packages/ansible
  ansible collection location = /home/kimdy/.ansible/collections:/usr/share/ansible/collections
  executable location = /home/kimdy/ansible-aws-docker-ops-enterprise/.venv/bin/ansible
  python version = 3.12.3 (main, Jan  8 2026, 11:30:50) [GCC 13.3.0] (/home/kimdy/ansible-aws-docker-ops-enterprise/.venv/bin/python)
  jinja version = 3.1.6
  pyyaml version = 6.0.3 (with libyaml v0.2.5)
```
```
sed -i 's/^stdout_callback *= *community\.general\.yaml/stdout_callback = ansible.builtin.default/' ansible.cfg
grep -q '^result_format' ansible.cfg || printf '\nresult_format = yaml\n' >> ansible.cfg
```

## 설치 후 겪을 수 있는 오류
```
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ cd ~/ansible-aws-docker-ops-enterprise
grep -nE "community\.general\.yaml|stdout_callback|callbacks_enabled|callback_whitelist" ansible.cfg
5:stdout_callback = yaml
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ cd ~/ansible-aws-docker-ops-enterprise
sed -i 's/^stdout_callback *= *yaml/stdout_callback = ansible.builtin.default/' ansible.cfg
grep -q '^result_format' ansible.cfg || printf 'result_format = yaml\n' >> ansible.cfg
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ grep -nE "stdout_callback|result_format" ansible.cfg
5:stdout_callback = ansible.builtin.default
13:result_format = yaml
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible-playbook -i inventories/dev/hosts.ini playbooks/00_ping.yml

PLAY [Ping] ******************************************************************************************************************************

TASK [ping] ******************************************************************************************************************************
ok: [local]

PLAY RECAP *******************************************************************************************************************************
local                      : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0 
```

### 3) 기본 테스트
```bash
ansible -i inventories/local/hosts.ini local -m ping
ansible-playbook playbooks/00_ping.yml
```

## 참고 사항
1. `docs/01_basics.md` : Ansible가 무엇이고, ad-hoc 명령/모듈 실행
2. `docs/02_inventory_vars.md` : 인벤토리/변수/팩트/조건문
3. `docs/03_playbooks_roles.md` : 플레이북 구조, Role로 분리
4. `docs/04_templates_handlers.md` : Jinja2 템플릿, 핸들러, idempotent 개념
5. `docs/05_vault_secrets.md` : Vault로 시크릿 관리
### 등등 docs 폴더 참조

### Nginx 설치 (로컬)
```bash
ansible-playbook -i inventories/local/hosts.ini playbooks/02_nginx.yml
```
```
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible-playbook -i inventories/local/hosts.ini playbooks/02_nginx.yml

PLAY [02) Install nginx and publish simple page (no role)] **********************************************************************

TASK [Gathering Facts] **********************************************************************************************************
ok: [localhost]

TASK [Install nginx (Debian/Ubuntu)] ********************************************************************************************



[ERROR]: Task failed: Module failed: Failed to lock apt for exclusive operation: Failed to lock directory /var/lib/apt/lists/: E:Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)
Origin: /home/kimdy/ansible-aws-docker-ops-enterprise/playbooks/02_nginx.yml:7:7

5
6   tasks:
7     - name: Install nginx (Debian/Ubuntu)
        ^ column 7

fatal: [localhost]: FAILED! => {"changed": false, "msg": "Failed to lock apt for exclusive operation: Failed to lock directory /var/lib/apt/lists/: E:Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)"}

PLAY RECAP **********************************************************************************************************************
localhost                  : ok=1    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0 
```
```
ansible-playbook -i inventories/local/hosts.ini playbooks/02_nginx.yml --become --ask-become-pass
```

### Role 기반 웹서버 배포
```bash
ansible-playbook -i inventories/local/hosts.ini playbooks/03_role_web.yml
```

### Docker 호스트에 엔진 설치
```bash
ansible-playbook -i inventories/docker/hosts.ini playbooks/10_docker_install.yml
```

### AWS VPC + EC2 만들기
```bash
# AWS 자격 증명은 환경변수 또는 ~/.aws/credentials(프로파일)로 설정
ansible-playbook playbooks/20_aws_create_vpc.yml -e aws_region=ap-northeast-2
ansible-playbook playbooks/21_aws_create_ec2.yml -e aws_region=ap-northeast-2
```

> 비용이 발생할 수 있으니, 실습 후 `playbooks/23_aws_cleanup.yml`로 정리하세요.

## Docker 엔진 설치 → Compose 배포

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/10_docker_engine_install.yml
```
```
(.venv) kimdy@DESKTOP-CLQV18N:~/ansible-aws-docker-ops-enterprise$ ansible-playbook -i inventories/dev/hosts.ini playbooks/10_docker_engine_install.yml

PLAY [Install Docker Engine] *************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************
[ERROR]: Task failed: Premature end of stream waiting for become success.
>>> Standard Error
sudo: a password is required

fatal: [local]: FAILED! => {"changed": false, "msg": "Task failed: Premature end of stream waiting for become success.\n>>> Standard Error\nsudo: a password is required"}

PLAY RECAP *******************************************************************************************************************************
local                      : ok=0    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0   
```
## 비번 문제 계속 발생 시
```
ansible-playbook -i inventories/dev/hosts.ini playbooks/10_docker_engine_install.yml -K
```
---
```
ansible-playbook -i inventories/dev/hosts.ini playbooks/11_deploy_stack.yml
```



## 3) Rolling 배포(멀티 호스트)

```bash
ansible-playbook -i inventories/prod/hosts.ini playbooks/12_deploy_stack_rolling.yml
```

## 4) Blue-Green 배포(단일 호스트)

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/13_blue_green_switch.yml
```

## 5) AWS (SSM 기반, SSH 없이)

- 문서: `docs/06_ssm_connection.md`

원샷 프로비저닝(EC2 생성 + SSM 역할/프로파일 + 태그):

```bash
ansible-playbook playbooks/20_aws_provision_ssm_no_ssh.yml \
  -e aws_region=ap-northeast-2 \
  -e environment=dev

ansible-inventory -i inventories/aws/aws_ec2.yml --graph
```

SSM로 구성/배포(SSH 없이):

```bash
ansible-playbook -i inventories/aws/aws_ec2.yml playbooks/21_post_provision_via_ssm.yml
```

정리(비용 방지):

```bash
ansible-playbook playbooks/23_aws_cleanup.yml -e aws_region=ap-northeast-2 -e environment=dev
```

---

자세한 단계별 가이드는 `docs/`를 참고하세요.
