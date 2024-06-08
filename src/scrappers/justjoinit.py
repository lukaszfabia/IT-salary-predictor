from random import randint
import re
import time
from typing import List, Dict, Set, Tuple
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.webdriver import WebDriver
from models.data_model import Offer
from selenium import webdriver
from typing import Dict, List


###############
#   Synonyms  #
###############

experiences: Dict[str, List[str]] = {
    "Junior": ["Junior", "junior", "jun"],
    "Mid": ["Mid", "mid", "middle", "midle", "regular"],
    "Senior": ["Senior", "senior", "lead", "sen", "c-level"],
}

operating_modes: Dict[str, List[str]] = {
    "Remote": ["Remote", "remote", "zdalnie", "zdalna", "zdalny"],
    "Office": ["Office", "office", "biurowo", "biurowa", "biurowy"],
    "Hybrid": ["Hybrid", "hybrid", "hybrydowo", "hybrydowa", "hybrydowy"],
}

locations: Dict[str, List[str]] = {
    "Warszawa": ["Warsaw", "Warszawa"],
    "Kraków": ["Krakow", "Kraków"],
    "Wrocław": ["Wroclaw", "Wrocław"],
    "Poznań": ["Poznan", "Poznań"],
    "Gdańsk": ["Gdansk", "Gdańsk"],
    "Szczecin": ["Szczecin, szczecin"],
    "Łódź": ["Lodz", "Łódź"],
    "Rzeszów": ["Rzeszow", "Rzeszów"],
    "Katowice": ["Katowice"],
    "Kielce": ["Kielce"],
    "Opole": ["opole", "Opole"],
    "Bydgoszcz": ["Bydgoszcz"],
    "Toruń": ["Torun", "Toruń"],
    "Lublin": ["Lublin"],
    "Olsztyn": ["Olsztyn"],
    "Białystok": ["Bialystok", "Białystok"],
}


# input should be normalized to lowercase
technologies: Dict[str, List[str]] = {
    "JavaScript": [
        "javascript",
        "js",
        "node.js",
        "nodejs",
        "express.js",
        "expressjs",
        "jquery",
        "javascript(es6/es7)",
    ],
    "Python": [
        "python",
        "python 3",
        "py",
        "pytest",
        "pyqt",
        "pyqt5",
        "pytorch",
        "pandas",
        "numpy",
        "tensorflow",
        "keras",
        "scikit-learn",
        "pyspark",
    ],
    "React": ["react", "react.js", "reactjs", "react native", "react-native"],
    "Django": ["django"],
    "Flask": ["flask"],
    "FastAPI": ["fastapi", "fast api"],
    "Docker/Kubernetes": [
        "docker",
        "kubernetes",
        "docker-compose",
        "docker swarm",
        "dockerfile",
        "yml",
        "yaml",
    ],
    "RESTAPI": ["restapi", "rest", "api", "restful api", "web api"],
    "Git": ["git", "github", "gitlab", "gitflow", "github actions"],
    "SQL": [
        "sql",
        "mysql",
        "postgresql",
        "sqlite",
        "mssql",
        "mariadb",
        "oracle",
        "oracledb",
        "microsft sql server",
        "sqlalchemy",
        "sql server",
        "bazy danych",
        "database",
        "pl/sql",
    ],
    "Linux": ["linux", "ubuntu", "debian", "centos", "redhat", "bash", "linux kernel"],
    "GraphQL": ["graphql"],
    "Java": [
        "java",
        "java 8",
        "java 11",
        "java 14",
        "java 15",
        "java 16",
        "java 17",
        "java 18",
        "java 19",
        "kotlin/java",
        "java/kotlin",
        "junit",
    ],
    "Spring": ["spring", "spring boot", "spring framework"],
    "HTML": ["html", "html5/css3", "html5"],
    "CSS": ["css", "css3", "html5/css3"],
    "TypeScript": ["typescript", "ts"],
    "Vue.js": ["vue.js", "vuejs", "vue"],
    "Angular": ["angular", "angular.js", "angularjs", "angular 2+", "angular 4"],
    "AWS": ["aws", "amazon web services", "amazon aws"],
    "Azure": ["azure", "microsoft azure", "ms azure", "azure devops"],
    "C#": [
        "c#",
        "csharp",
        "c sharp",
        "c-sharp",
        ".net",
        "net",
        "asp.net",
        "aspnet",
        "asp net",
        "asp",
        ".net core",
        ".net framework",
        "vb .net",
        "microsoft .net core",
        ".net 6",
        ".net 7",
        ".net 8",
        ".net 9",
        ".net 10",
    ],
    "Ruby": ["ruby", "ruby on rails", "ror"],
    "PHP": ["php", "laravel", "symfony", "zend", "wordpress"],
    "NoSQL": ["nosql", "mongodb", "couchdb", "cassandra", "redis", "firebase"],
    "Jenkins": ["jenkins"],
    "IOS": ["ios", "swift", "objective-c", "xcode"],
    "android": ["android", "kotlin", "android sdk"],
    "C++": ["c++", "cpp", "c", "c++ 17", "stl", "c++ 20", "c++ 11", "c++ 14"],
    "Go": ["go", "golang"],
    "Terraform": ["terraform"],
    "Windows": ["windows", "win", "winapi", "win32"],
    "JIRA": ["jira"],
    "Scala": ["scala", "akka", "play", "play framework"],
}


LINKS: Dict[str, str] = {
    "js": "https://justjoin.it/all-locations/javascript/employment-type_b2b.permanent/with-salary_yes",
    "html": "https://justjoin.it/all-locations/html/employment-type_b2b.permanent/with-salary_yes",
    "php": "https://justjoin.it/all-locations/php/employment-type_b2b.permanent/with-salary_yes",
    "ruby": "https://justjoin.it/all-locations/ruby/employment-type_b2b.permanent/with-salary_yes",
    "python": "https://justjoin.it/all-locations/python/employment-type_b2b.permanent/with-salary_yes",
    "java": "https://justjoin.it/all-locations/java/employment-type_b2b.permanent/with-salary_yes",
    "net": "https://justjoin.it/all-locations/net/employment-type_b2b.permanent/with-salary_yes",
    "c": "https://justjoin.it/all-locations/c/employment-type_b2b.permanent/with-salary_yes",
    "scala": "https://justjoin.it/all-locations/scala/employment-type_b2b.permanent/with-salary_yes",
    "mobile": "https://justjoin.it/all-locations/mobile/employment-type_b2b.permanent/with-salary_yes",
    "devops": "https://justjoin.it/all-locations/devops/employment-type_b2b.permanent/with-salary_yes",
    "game": "https://justjoin.it/all-locations/game/employment-type_b2b.permanent/with-salary_yes",
    "data": "https://justjoin.it/all-locations/data/employment-type_b2b.permanent/with-salary_yes",
    "go": "https://justjoin.it/all-locations/go/employment-type_b2b.permanent/with-salary_yes",
}


###############
#   Scrapper  #
###############


class PrepareOffer:
    name_xpath: str = (
        '//*[@id="__next"]/div[2]/div[1]/div/div[2]/div[2]/div[1]/div[2]/div[2]/h1'
    )

    experience_xpath: str = (
        '//*[@id="__next"]/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[2]/div[2]/div[2]'
    )

    operating_mode_xpath: str = (
        '//*[@id="__next"]/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[4]/div[2]/div[2]'
    )

    def __init__(self, driver: WebDriver, link: str):
        self.link: str = link
        self.driver: WebDriver = driver

    def get_offer(self) -> Offer:
        """preprocess offer

        Returns:
            Offer: offer wrapped in Offer class
        """
        self.driver.get(self.link)
        # return self.get_name(), self.get_experience(), self.get_operating_mode()
        min_b2b, max_b2b, min_uop, max_uop = self.get_salary()
        return Offer(
            title=self.get_name(),
            min_b2b=min_b2b,
            max_b2b=max_b2b,
            min_uop=min_uop,
            max_uop=max_uop,
            technologies=self.get_technologies(),
            locations=self.get_locations(),
            experience=self.get_experience(),
            operating_mode=self.get_operating_mode(),
        )
        # return self.get_locations()

    def get_locations(self) -> List[str]:
        """getting a locations from the offer

        Returns:
            List[str]: list with normalized locations
        """
        # try to click cookies button
        try:
            self.driver.find_element(By.ID, value="cookiescript_accept").click()
        except:
            pass

        # general location
        first_loc: str = self.driver.find_element(
            By.CLASS_NAME, value="css-1seeldo"
        ).text

        first_loc = re.split(r"\s*,\s*", first_loc)[0]

        # for key in locations.keys():
        #     if first_loc in locations[key]:
        #         first_loc = key

        first_loc = next(
            (key for key in locations if first_loc in locations[key]), first_loc
        )

        # try to click multilocation button
        try:
            self.driver.find_element(By.NAME, value="multilocation_button").click()
        except:
            return [first_loc]
        locs: List[str] = self.driver.find_elements(By.CLASS_NAME, value="css-1si1hfj")

        res: Set[str] = set()
        res.add(first_loc)
        # matching rest of the locations
        for loc in locs:
            tmp: str = re.split(r"\s*,\s*", loc.text)[0]
            for k in locations.keys():
                if tmp in locations[k]:
                    res.add(k)
        return list(res)

    def get_technologies(self) -> List[str]:
        """getting a technologies from the offer

        Returns:
            List[str]: list with normalized technologies
        """
        tech_stack: List[str] = [
            e.text for e in self.driver.find_elements(By.CLASS_NAME, value="css-x1xnx3")
        ]
        res: Set[str] = set()
        for e in tech_stack:
            # maybe useless
            if isinstance(e, str):
                for k, v in technologies.items():
                    # check if any of the aliases is in the string
                    if any(
                        re.match(rf"^{re.escape(alias)}$", e, re.IGNORECASE)
                        for alias in v
                    ):
                        # add key (normalized technology name)
                        res.add(k)
        return list(res)

    def get_experience(self) -> str:
        return self.get_info(x_path=self.experience_xpath, match_dict=experiences)

    def get_operating_mode(self) -> str:
        return self.get_info(
            x_path=self.operating_mode_xpath, match_dict=operating_modes
        )

    def get_salary(self) -> Tuple[float, float, float, float]:
        """salary of given job offer

        Returns:
            Tuple[float, float, float, float]: min_b2b, max_b2b, min_uop, max_uop
        """
        salaries = self.driver.find_elements(By.CLASS_NAME, value="css-1pavfqb")
        contract_types = self.driver.find_elements(By.CLASS_NAME, value="css-1waow8k")
        min_b2b, max_b2b, min_uop, max_uop = 0.0, 0.0, 0.0, 0.0
        for sal, con in zip(salaries, contract_types):
            try:
                min, max = sal.text.removesuffix(" PLN").rstrip().split(" - ")
                min = float(min.replace(" ", ""))
                max = float(max.replace(" ", ""))
            except:
                min = max = float(sal.text.removesuffix(" PLN").replace(" ", ""))

            if "Permanent" in con.text:
                min_uop = min
                max_uop = max
            if "B2B" in con.text:
                min_b2b = min
                max_b2b = max

        return min_b2b, max_b2b, min_uop, max_uop

    def get_name(self) -> str:
        return self.get_info(x_path=self.name_xpath, match_dict=dict(), is_title=True)

    def get_info(
        self, x_path: str, match_dict: Dict[str, List[str]], is_title: bool = False
    ) -> str:
        """general function to get information from the offer

        Args:
            x_path (str): path to the element
            match_dict (Dict[str, List[str]]): ditcionary with matching values
            is_title (bool, optional): handling title cuz it hasnt dict. Defaults to False.

        Returns:
            str: _description_
        """
        element: str = self.driver.find_element(By.XPATH, value=x_path).text
        if not is_title:
            for key in match_dict.keys():
                if element.lower() in match_dict[key]:
                    return key
        else:
            return element.replace(",", " ")


def get_links_to_offers(driver: WebDriver, link: str) -> List[str]:
    """Returns all links to offers.
    warining: use Safari driver on osx

    Args:
        driver (WebDriver): selenium webdriver
        link (str): link to justjoin.it

    Returns:
        List[str]: set of links casted to offers list
    """
    driver.get(link)
    try:
        driver.find_element(By.ID, value="cookiescript_accept").click()
    except:
        pass

    set_of_links: Set[str] = set()
    old_count = 0
    new_count = 0
    n = 1
    time.sleep(randint(3, 5))
    while True:
        old_count = new_count
        new_count = len(set_of_links)

        # Find elements based on the current XPath pattern
        xpath_pattern = f'//*[@id="__next"]/div[2]/div[1]/div/div[2]/div/div/div[3]/div/div[2]/div[{n}]/div/div/a'
        link_elements = driver.find_elements(By.XPATH, xpath_pattern)

        if link_elements:  # If elements are found
            prev_link_elements = link_elements
            links = [link.get_attribute("href") for link in link_elements]
            for link in links:
                set_of_links.add(link)
            n += 1
        else:
            driver.execute_script(
                "arguments[0].scrollIntoView();",
                prev_link_elements[len(prev_link_elements) - 1],
            )
            n = 1
            time.sleep(randint(3, 5))

            if old_count == new_count:  # end
                break

    return list(set_of_links)


def load_links(filename: str = "new_links.txt") -> List[str]:
    """load links from file to list

    Args:
        filename (str, optional): file name. Defaults to "new_links.txt".

    Returns:
        List[str]: list with links
    """
    links: List[str] = list()
    with open(filename) as f:
        for line in f:
            links.append(line.strip())
    return links


if __name__ == "__main__":
    # res = get_links_to_offers(webdriver.Safari(), LINKS["js"])
    print("[")
    read_links = load_links("new_links.txt")
    for index, link in enumerate(read_links):
        try:
            preprocess = PrepareOffer(driver=webdriver.Chrome(), link=link)
            print(preprocess.get_offer().__dict__(), end=",")
        except:
            print(f"Error at {link}")
    print("]")
    # link = "https://justjoin.it/offers/relativity-software-engineer---product-security-krakow-security"
    # link1 = "https://justjoin.it/offers/smartbear-front-end-engineer-reflect-wroc-aw-javascript"
    # link2 = "https://justjoin.it/offers/bayer-sp-z-o-o-senior-software-engineer-full-stack-javascript"
    # preprocess = PrepareOffer(driver=webdriver.Chrome(), link=link2)
    # print(preprocess.get_offer())
